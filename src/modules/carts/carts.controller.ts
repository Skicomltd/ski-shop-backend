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
import { PaymentsService } from "../services/payments/payments.service"
import { InitiatePayment } from "../services/payments/interfaces/strategy.interface"
import { OrdersService } from "../orders/orders.service"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { UserService } from "../users/user.service"
import { HelpersService } from "../services/utils/helpers/helpers.service"

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private productService: ProductsService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
    private readonly transactionHelper: TransactionHelper,
    private readonly userService: UserService,
    private readonly helperService: HelpersService
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
  async checkout(@Body(new JoiValidationPipe(checkoutSchema)) createCartDto: CheckoutDto, @Req() req: Request) {
    const user = req.user

    return this.transactionHelper.runInTransaction(async (manager) => {
      if (!(await this.cartsService.exists({ user: { id: user.id } }))) throw new NotFoundException("empty cart")

      const [carts] = await this.cartsService.find({ user: { id: user.id } })

      const amount = await this.cartsService.calculateTotalPrice(user.id)

      const reference = this.helperService.generateReference("REF-", 11)

      await this.ordersService.create(
        {
          buyerId: user.id,
          paymentMethod: createCartDto.paymentMethod,
          reference,
          items: carts.map((cart) => ({
            quantity: cart.quantity,
            unitPrice: cart.product.discountPrice && cart.product.discountPrice > 0 ? cart.product.discountPrice : cart.product.price,
            productId: cart.product.id,
            storeId: cart.product.storeId
          }))
        },
        manager
      )

      // to help track the order and item counts for user and vendor
      // question: does this make sense here or in the order webhooks
      await this.userService.update(user, { ordersCount: user.ordersCount + 1 }, manager)
      const storeIds = carts.map((cart) => cart.product.storeId)
      const vendors = await Promise.all(
        storeIds.map(async (storeId) => {
          const vendor = await this.userService.findOne({ business: { store: { id: storeId } } })
          const itemCount = carts.filter((cart) => cart.product.storeId === storeId).length
          return { vendor, itemCount }
        })
      )
      await Promise.all(
        vendors.map(({ vendor, itemCount }) => this.userService.update(vendor, { itemsCount: vendor.itemsCount + itemCount }, manager))
      )

      const payload: InitiatePayment = {
        amount,
        email: user.email,
        reference: reference
      }

      return await this.paymentsService.with(createCartDto.paymentMethod).initiatePayment(payload)
    })
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
}
