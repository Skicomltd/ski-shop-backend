import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { PaystackWebhookGuard } from "./guard/paystack.guard"
import { Public } from "../auth/decorators/public.decorator"
import { PaystackChargeSuccess, PaystackTransferData, PaystackWebhook } from "@services/payments/interfaces/paystack.interface"
import { FezWebhookDto } from "./dto/fez.dto"
import { OrderItemService } from "../orders/orderItem.service"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { EventRegistry } from "@/events/events.registry"
import { OrdersService } from "../orders/orders.service"
import { Webhook } from "../auth/decorators/webhook.decorator"

@Public()
@Webhook()
@Controller("webhooks")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly orderItemService: OrderItemService,
    private readonly ordersService: OrdersService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Public()
  @UseGuards(PaystackWebhookGuard)
  @Post("paystack")
  async handlePaystackWebhook(@Body() body: PaystackWebhook) {
    if (body.event === "charge.success") {
      this.webhookService.handleChargeSuccess(body.data as PaystackChargeSuccess)
    } else if (body.event === "invoice.create") {
      this.webhookService.handleInvoiceCreate(body.data as PaystackChargeSuccess)
    } else if (body.event === "transfer.success") {
      this.webhookService.handleTransferSuccess(body.data as PaystackTransferData)
    } else if (body.event === "transfer.failed") {
      this.webhookService.handleTransferFailed(body.data as PaystackTransferData)
    } else if (body.event === "transfer.reversed") {
      this.webhookService.handleTransferFailed(body.data as PaystackTransferData)
    }
  }
  // webhook came in from fez! { orderNumber: 'NOPB04122542', status: 'Enroute To Last Mile Hub' }
  @Public()
  @Webhook()
  @Post("fez")
  async handleFezWebhook(@Body() body: FezWebhookDto) {
    console.error("webhook came in from fez!", body)

    const orderItem = await this.orderItemService.findOne({ deliveryNo: body.orderNumber })
    if (!orderItem) return

    const status = this.orderItemService.mapFezStatus(body.status)
    const updated = await this.orderItemService.update(orderItem, { deliveryStatus: status })

    // Notify Customer + vendor
    this.eventEmitter.emit(EventRegistry.ORDER_STATUS_CHANGED, updated)

    if (status === "delivered") {
      const order = await this.ordersService.findById(orderItem.orderId)
      this.eventEmitter.emit(EventRegistry.ORDER_PAID_AFTER_DELIVERY, order, orderItem)
    }

    return
  }
}
