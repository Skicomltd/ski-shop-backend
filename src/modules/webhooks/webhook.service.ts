import { Injectable, Logger } from "@nestjs/common"
import { PaystackWebhookDto } from "./dto/paystack-webhook-dto"
import { OrdersService } from "../orders/orders.service"
import { NotFoundException } from "@/exceptions/notfound.exception"

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)

  constructor(private orderService: OrdersService) {}

  async handlePaystackWebhookEvent(payload: PaystackWebhookDto) {
    const { event, data } = payload

    if (event === PaystackEventEnum.success) {
      const order = await this.orderService.findOne({ id: data.reference })
      if (!order) throw new NotFoundException("Order does not exist")
      try {
        await this.orderService.update(order, { status: "pending", paymentStatus: "paid" })
        this.logger.log(`Order ${order.id} marked as pending.`)
      } catch (error) {
        this.logger.error(`Failed to update order ${order.id}: ${error.message}`)
        throw error
      }
      return { status: "success" }
    }

    this.logger.warn(`Unhandled Paystack event: ${event}`)
    return { status: "ignored" }
  }
}
