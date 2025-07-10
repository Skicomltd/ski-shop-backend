import { Injectable } from "@nestjs/common"
import { OrdersService } from "../orders/orders.service"
import { PaystackChargeSuccess } from "../services/payments/interfaces/paystack.interface"

@Injectable()
export class WebhookService {
  constructor(private orderService: OrdersService) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const order = await this.orderService.findById(data.reference)

    // validate payment
  }

  // async handlePaystackWebhookEvent(payload: PaystackWebhookDto) {
  //   const { event, data } = payload

  //   if (event === PaystackEventEnum.success) {
  //     const order = await this.orderService.findOne({ id: data.reference })
  //     if (!order) throw new NotFoundException("Order does not exist")
  //     try {
  //       await this.orderService.update(order, { status: "pending", paymentStatus: "paid" })
  //       this.logger.log(`Order ${order.id} marked as pending.`)
  //     } catch (error) {
  //       this.logger.error(`Failed to update order ${order.id}: ${error.message}`)
  //       throw error
  //     }
  //     return { status: "success" }
  //   }

  //   this.logger.warn(`Unhandled Paystack event: ${event}`)
  //   return { status: "ignored" }
  // }
}
