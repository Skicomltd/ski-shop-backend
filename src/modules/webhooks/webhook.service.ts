import { Injectable } from "@nestjs/common"
import { OrdersService } from "../orders/orders.service"
import { PaymentsService } from "../services/payments/payments.service"
import { PaystackChargeSuccess } from "../services/payments/interfaces/paystack.interface"
import { CartsService } from "../carts/carts.service"
import { SubscriptionService } from "../subscription/subscription.service"
import { SubscriptionEnum } from "../subscription/entities/subscription.entity"
import { UserService } from "../users/user.service"
import { StoreService } from "../stores/store.service"

@Injectable()
export class WebhookService {
  constructor(
    private orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly cartsService: CartsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly storeService: StoreService
  ) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const subscription = await this.subscriptionService.findOne({
      reference: data.reference
    })

    if (subscription) {
      await this.handleChargeSuccessForSubscription(data)
      return
    }

    await this.handleChargeSuccessForOrders(data)
  }

  async handleChargeSuccessForSubscription(data: PaystackChargeSuccess) {
    const subscription = await this.subscriptionService.findOne({
      reference: data.reference
    })

    if (!subscription || subscription.status === SubscriptionEnum.ACTIVE) {
      return
    }

    const isValid = await this.paymentsService.with("paystack").validatePayment(data.reference)
    if (!isValid) {
      return
    }
    const vendor = await this.userService.findOne({ id: subscription.vendorId })

    if (!vendor) return

    await this.subscriptionService.update(subscription, {
      status: SubscriptionEnum.ACTIVE
    })

    const store = await this.storeService.findOne({ id: vendor.business.store.id })

    if (!store) {
      return
    }

    await this.storeService.update(store, { isStarSeller: true })

    return
  }

  async handleChargeSuccessForOrders(data: PaystackChargeSuccess) {
    const order = await this.orderService.findById(data.reference)
    if (!order || order.status === "paid") {
      return
    }

    // validate payment
    const isValid = this.paymentsService.with("paystack").validatePayment(order.id)
    if (!isValid) return

    // clear user cart
    await this.cartsService.remove({ user: { id: order.buyerId } })

    await this.orderService.update(order, {
      status: "paid",
      deliveryStatus: "pending",
      paidAt: data.paidAt
    })
    return
  }

  async handleInvoiceCreate(data: PaystackChargeSuccess) {
    const user = await this.userService.findOne({ email: data.customer.email })

    if (!user) return

    const subscription = await this.subscriptionService.getSubscription({ code: data.subscription.subscription_code })

    if (!subscription) return

    await this.subscriptionService.create({
      amount: data.transaction.amount,
      planCode: subscription.plan_code,
      planType: subscription.interval,
      status: SubscriptionEnum.INACTIVE,
      reference: data.transaction.reference,
      vendorId: user.id,
      startDate: data.period_start,
      endDate: data.period_end,
      subscriptionCode: data.subscription.subscription_code
    })
  }
}
