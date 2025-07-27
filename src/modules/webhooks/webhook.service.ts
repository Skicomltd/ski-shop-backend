import { Injectable } from "@nestjs/common"

import { OrdersService } from "../orders/orders.service"
import { PaymentsService } from "../services/payments/payments.service"
import { PaystackChargeSuccess } from "../services/payments/interfaces/paystack.interface"
import { CartsService } from "../carts/carts.service"

@Injectable()
export class WebhookService {
  constructor(
    private orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly cartsService: CartsService
  ) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const order = await this.orderService.findById(data.reference)
    if (!order || order.status === "paid") return

    // validate payment
    const isValid = this.paymentsService.with("paystack").validatePayment(order.id)
    if (!isValid) return

    // clear user cart
    await this.cartsService.remove({ user: { id: order.buyerId } })

    await this.orderService.update(order, { status: "paid", deliveryStatus: "pending", paidAt: data.paidAt })

    // TRIGGER PRODUCT DELIVERY
  }
}
