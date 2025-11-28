import { Request } from "express"
import { Controller, Post, Body, Req, Get, Param, ParseUUIDPipe, Delete, Patch, UseInterceptors } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CreateCartDto, createCartSchema } from "./dto/create-cart.dto"
import { UpdateCartDto, updateCartSchema } from "./dto/update-cart.dto"
import { ProductsService } from "../products/products.service"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { ProductStatusEnum } from "../common/types"
import { CartInterceptor } from "./interceptors/cart.interceptor"
import { ConflictException } from "@/exceptions/conflict.exception"
import { CartsInterceptor } from "./interceptors/carts.interceptor"
import { CheckoutDto, checkoutSchema } from "./dto/checkout.dto"
import { PaymentsService } from "@services/payments/payments.service"
import { InitiatePayment } from "@services/payments/interfaces/strategy.interface"
import { OrdersService } from "../orders/orders.service"
import { TransactionHelper } from "@services/utils/transactions/transactions.service"
import { HelpersService } from "@services/utils/helpers/helpers.service"
import { VoucherService } from "../vouchers/voucher.service"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { VoucherEnum } from "../vouchers/enum/voucher-enum"
import { ConfigService } from "@nestjs/config"
import { PaymentModuleOption } from "@/services/payments"
import { EstimateDeliveryDateDto, estimateDeliveryDateSchema } from "../carts/dto/estimate-delivery-date.dto"
import { StoreService } from "../stores/store.service"
import { FezService } from "@/services/fez"
import { Order } from "../orders/entities/order.entity"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventRegistry } from "@/events/events.registry"

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private productService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
    private readonly transactionHelper: TransactionHelper,
    private readonly helperService: HelpersService,
    private readonly voucherService: VoucherService,
    private readonly configService: ConfigService,
    private readonly storesService: StoreService,
    private readonly fezService: FezService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post()
  @UseInterceptors(CartInterceptor)
  async create(@Body(new JoiValidationPipe(createCartSchema)) createCartDto: CreateCartDto, @Req() req: Request) {
    const user = req.user

    const product = await this.productService.findOne({ id: createCartDto.productId, status: ProductStatusEnum.published })
    if (!product) throw new NotFoundException("product not found")

    const exists = await this.cartsService.exists({ user: { id: user.id }, product: { id: product.id } })
    if (exists) throw new ConflictException("duplicate product in cart, increase quantity instead")

    return await this.cartsService.create({ user, product, quantity: createCartDto.quantity })
  }

  @Post("checkout")
  async checkout(@Body(new JoiValidationPipe(checkoutSchema)) checkoutDto: CheckoutDto, @Req() req: Request) {
    const user = req.user

    const voucher = await this.voucherService.findById(checkoutDto.voucherId)
    if (checkoutDto.voucherId && !voucher) throw new BadReqException("voucher not found")
    if (checkoutDto.voucherId && voucher.status === VoucherEnum.REDEEMED) throw new BadReqException("voucher redeemed")

    return this.transactionHelper.runInTransaction(async (manager) => {
      const [carts, count] = await this.cartsService.find({ user: { id: user.id } })
      if (count <= 0) throw new NotFoundException("empty cart")

      for (const cart of carts) {
        const product = await this.productService.findOne({ id: cart.product.id, status: ProductStatusEnum.published })

        if (!product) throw new NotFoundException(`${product.name} currently does not exist`)

        if (product.stockCount <= 0) {
          throw new BadReqException(`${product.name} is currently out of stock.`)
        }
      }

      const amount = await this.cartsService.calculateTotalPrice(user.id)
      const reference = this.helperService.generateReference("REF-")
      const order = await this.ordersService.create(
        {
          buyerId: user.id,
          paymentMethod: checkoutDto.paymentMethod,
          reference,
          shippingInfo: {
            recipientAddress: checkoutDto.shippingAddress.address,
            recipientEmail: checkoutDto.shippingAddress.email,
            recipientName: checkoutDto.shippingAddress.name,
            recipientPhone: checkoutDto.shippingAddress.phoneNumber,
            recipientState: checkoutDto.shippingAddress.state,
            shippingFee: checkoutDto.shippingFee
          },
          items: carts.map((cart) => ({
            quantity: cart.quantity,
            unitPrice: cart.product.discountPrice && cart.product.discountPrice > 0 ? cart.product.discountPrice : cart.product.price,
            productId: cart.product.id,
            storeId: cart.product.storeId
          }))
        },
        manager
      )

      const payload: InitiatePayment = {
        amount,
        email: user.email,
        callback_url: this.configService.get<PaymentModuleOption>("payment").providers.paystack.callbackUrl,
        reference: order.reference
      }

      if (checkoutDto.voucherId) {
        payload.amount = this.voucherService.applyVoucher(voucher, amount)
        await this.voucherService.update(voucher, { orderId: order.id }, manager)
      }

      if (checkoutDto.paymentMethod === "paymentOnDelivery") {
        this.eventEmitter.emit(EventRegistry.ORDER_PLACED_POD, order)

        return {
          checkoutUrl: "",
          reference: order.reference,
          checkoutCode: ""
        }
      }

      return await this.paymentsService.with(checkoutDto.paymentMethod).initiatePayment(payload)
    })
  }

  @Post("/delivery-info")
  async estimateDeliveryDate(@Body(new JoiValidationPipe(estimateDeliveryDateSchema)) dto: EstimateDeliveryDateDto, @Req() req: Request) {
    const user = req.user

    const [cart] = await this.cartsService.find({ user: { id: user.id } })
    if (!cart.length) throw new NotFoundException("Cart does not exist")

    let totalCost = 0 // total cost of all deliveries
    let earliestDay = Infinity // Earliest delivery date
    let maximumDay = 1 // Max delivery date

    for (const item of cart) {
      const store = await this.storesService.findById(item.product.storeId)
      const cost = await this.fezService.getDeliveryCost({
        state: dto.dropOffState,
        pickUpState: store.business.state,
        weight: item.product.weight
      })

      totalCost += cost

      const date = await this.fezService.getDeliveryDateEstimate({
        delivery_type: "local",
        pick_up_state: store.business.state,
        drop_off_state: dto.dropOffState
      })

      const [min, max] = date.split(" ").filter((i) => Number.isInteger(Number(i)))
      earliestDay = Math.min(earliestDay, min ? Number(min) : 1)
      maximumDay = Math.max(maximumDay, max ? Number(max) : 0)
    }

    const today = new Date()
    const minDate = today.setDate(today.getDate() + Number(earliestDay))
    const maxDate = today.setDate(today.getDate() + Number(maximumDay))

    return {
      cost: totalCost,
      minDate: new Date(minDate).toISOString(),
      maxDate: new Date(maxDate).toISOString()
    }
  }

  @Get()
  @UseInterceptors(CartsInterceptor)
  async findAll(@Req() req: Request) {
    const user = req.user
    return await this.cartsService.find({ user: { id: user.id } })
  }

  @Get("/:id")
  @UseInterceptors(CartInterceptor)
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const cart = await this.cartsService.findById(id)
    if (!cart) throw new NotFoundException(`cart not found`)
    return this.cartsService.findById(id)
  }

  @Patch(":id")
  @UseInterceptors(CartInterceptor)
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateCartSchema)) updateCartDto: UpdateCartDto) {
    const cart = await this.cartsService.findById(id)
    if (!cart) throw new NotFoundException(`cart not found`)
    return await this.cartsService.update(cart, updateCartDto)
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const count = await this.cartsService.remove({ id })
    if (count > 0) return "cart deleted successfully"
    return "Not deleted"
  }

  @OnEvent(EventRegistry.ORDER_PLACED_PAID)
  @OnEvent(EventRegistry.ORDER_PLACED_POD)
  async handleOrderPlaced(order: Order) {
    await this.cartsService.remove({ user: { id: order.buyerId } })
  }
}
