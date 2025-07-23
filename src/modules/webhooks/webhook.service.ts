import { Injectable } from "@nestjs/common"
import { OrdersService } from "../orders/orders.service"
import { PaymentsService } from "../services/payments/payments.service"
import { PaystackChargeSuccess } from "../services/payments/interfaces/paystack.interface"
import { SubscriptionService } from "../subscription/subscription.service"
import { SubscriptionEnum } from "../subscription/entities/subscription.entity"

@Injectable()
export class WebhookService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const subscription = await this.subscriptionService.findOne({
      reference: data.reference
    })

    if (subscription) {
      await this.handleChargeSuccessForSubscription(data.reference)
      return
    }

    await this.handleChargeSuccessForOrders(data)
  }

  async handleChargeSuccessForSubscription(reference: string) {
    const subscription = await this.subscriptionService.findOne({
      reference: reference
    })

    if (!subscription || subscription.status === SubscriptionEnum.ACTIVE) {
      return
    }

    const isValid = await this.paymentsService.with("paystack").validatePayment(reference)
    if (!isValid) {
      return
    }

    await this.subscriptionService.update(subscription, {
      status: SubscriptionEnum.ACTIVE
    })
  }

  async handleChargeSuccessForOrders(data: PaystackChargeSuccess) {
    try {
      const order = await this.orderService.findById(data.reference)
      if (!order || order.status === "paid") {
        return
      }

      // validate payment
      const isValid = await this.paymentsService.with("paystack").validatePayment(data.reference)
      if (!isValid) {
        return
      }

      await this.orderService.update(order, {
        status: "paid",
        deliveryStatus: "pending",
        paidAt: data.paidAt
      })
    } catch (error) {
      console.error("Error handling order charge success:", error)
      throw error
    }
  }
}
