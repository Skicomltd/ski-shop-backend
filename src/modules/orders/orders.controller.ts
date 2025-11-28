import { Body, Controller, Get, Param, ParseUUIDPipe, Query, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrdersInterceptor } from "./interceptors/orders.interceptor"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { OrderInterceptor } from "./interceptors/order.interceptor"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "@services/casl/casl-ability.factory"
import { PolicyOrderGuard } from "./guard/policy-order.guard"
import { Action } from "@services/casl/actions/action"
import { Order } from "./entities/order.entity"
import { Request } from "express"
import { FindOptionsWhere } from "typeorm"
import { UserRoleEnum } from "../users/entity/user.entity"
import { Response } from "express"
import { CsvService } from "@services/utils/csv/csv.service"
import { OrderSummaryData } from "./interfaces/order-summary.interface"
import { Public } from "../auth/decorators/public.decorator"
import { FezService } from "@/services/fez"
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter"
import { EventRegistry } from "@/events/events.registry"
import { NotificationsService } from "@/services/notifications/notifications.service"
import { VendorOrderItemPlacedNotification } from "@/notifications/vendors/order-item-placed.notification"
import { CustomerOrderPlacedNotification } from "@/notifications/customers/order-placed-notification"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { createRequestDeliverySchema, RequestDeliveryDto } from "./dto/request-delivery.dto"
import { OrderItemService } from "./orderItem.service"
import { OrderItem } from "./entities/order-item.entity"

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemService,
    private readonly csvService: CsvService,
    private readonly fezService: FezService,
    private readonly notificationService: NotificationsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrdersInterceptor)
  @Get("/")
  findAll(@Query() query: IOrdersQuery, @Req() req: Request) {
    const user = req.user
    if (user.role === UserRoleEnum.Customer) {
      query.buyerId = user.id
    } else if (user.role === UserRoleEnum.Vendor) {
      query.storeId = user.business?.store?.id
    }
    return this.ordersService.find(query)
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Order))
  @Get("download")
  async downloads(@Query() query: IOrdersQuery, @Res() res: Response) {
    const [orders] = await this.ordersService.find(query)

    const headers = [
      { key: "product", header: "Product" },
      { key: "orderId", header: "Order ID" },
      { key: "amount", header: "Amount" },
      { key: "customerName", header: "Customer Name" },
      { key: "dateAndTime", header: "Date and Time" },
      { key: "status", header: "Status" }
    ]

    const records = orders.flatMap((order) => {
      return order.items.map((item) => {
        return {
          product: item.product.name,
          orderId: order.id,
          customerName: order.buyer.getFullName(),
          status: item.deliveryStatus,
          dateAndTime: order.createdAt.toISOString(),
          amount: item.unitPrice * item.quantity
        }
      })
    })

    const data = await this.csvService.writeCsvToBuffer({ headers, records })

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv")
    res.send(data)
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Order))
  @Get("download/:id")
  async orderSummary(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
    const order = await this.ordersService.findById(id)
    if (!order) {
      throw new NotFoundException("Order does not exist")
    }

    const orderSummary: OrderSummaryData = {
      order: {
        dateTime: order.paidAt,
        id: order.id,
        paymentStatus: order.status,
        totalAmount: order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      },
      products: order.items.map((item) => {
        return {
          buyer: order?.buyer.getFullName(),
          name: item.product.name,
          price: item.unitPrice,
          quantity: item.quantity
        }
      })
    }

    const pdfBuffer = await this.ordersService.generateOrderSummaryPdf(orderSummary)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", "attachment; filename=order-summary.pdf")
    res.send(pdfBuffer)
  }

  @Public()
  @Get("/delivery-states")
  async delieveryStates() {
    return this.fezService.getStates()
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrderInterceptor)
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    const filter: FindOptionsWhere<Order> & { storeId?: string } = { id }

    if (req.user.role !== UserRoleEnum.Customer) {
      filter.storeId = req.user.business.store.id
    }

    const order = this.ordersService.findOne(filter)

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Order))
  async requestDelivery(@Body(new JoiValidationPipe(createRequestDeliverySchema)) requestDeliveryDto: RequestDeliveryDto) {
    const order = await this.ordersService.findById(requestDeliveryDto.orderId)
    const orderItem = await this.orderItemsService.findById(requestDeliveryDto.orderItemId)

    const delivery = await this.fezService.createOrder({
      batchId: order.id,
      uniqueId: orderItem.id,
      recipientName: order.buyer.getFullName(),
      recipientAddress: order.shippingInfo.recipientAddress,
      recipientState: order.shippingInfo.recipientState,
      recipientPhone: order.shippingInfo.recipientPhone,
      recipientEmail: order.shippingInfo.recipientEmail,
      custToken: order.shippingInfo.recipientPhone.substring(-4),
      itemDescription: orderItem.product.description,
      valueOfItem: String(orderItem.unitPrice * orderItem.quantity),
      weight: orderItem.product.weight * orderItem.quantity,
      pickUpState: orderItem.product.store.business.state,
      pickUpAddress: orderItem.product.store.business.address,
      pickUpDate: new Date().toISOString(),
      isItemCod: order.paymentMethod === "paymentOnDelivery",
      cashOnDeliveryAmount: order.shippingInfo.shippingFee + (orderItem.unitPrice + orderItem.quantity),
      fragile: orderItem.product.fragile
    })

    const deliveryNo = delivery.orderNos[orderItem.id]

    const expectedAt = await this.fezService.getDeliveryDateEstimate({
      delivery_type: "local",
      pick_up_state: orderItem.product.store.business.state,
      drop_off_state: order.shippingInfo.recipientState
    })

    const [min] = expectedAt.split(" ").filter((i) => Number.isInteger(Number(i)))
    const today = new Date()
    const expctedAt = today.setDate(today.getDate() + Number(min))

    const updatedItem = await this.orderItemsService.update(orderItem, {
      deliveryNo,
      expectedAt: new Date(expctedAt),
      deliveryStatus: "pending"
    })

    // Notify customer of updated status
    this.eventEmitter.emit(EventRegistry.ORDER_DELIVERY_REQUESTED, updatedItem)
  }

  @OnEvent(EventRegistry.ORDER_PLACED)
  async handleOrderCreatedEvent(order: Order) {
    // Notify vendors
    for (const item of order.items) {
      this.notificationService.notify(new VendorOrderItemPlacedNotification(item, order.id))
    }

    // Notify customer
    this.notificationService.notify(new CustomerOrderPlacedNotification(order))
  }

  @OnEvent(EventRegistry.ORDER_DELIVERY_REQUESTED)
  async handleDeliveryRequested(order: OrderItem) {
    // // Notify vendors
    // for (const item of order.items) {
    //   this.notificationService.notify(new VendorOrderItemPlacedNotification(item, order.id))
    // }
    // // Notify customer
    // this.notificationService.notify(new CustomerOrderPlacedNotification(order))
  }
}
