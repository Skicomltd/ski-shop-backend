import { Injectable } from "@nestjs/common"
import { OrdersService } from "../orders/orders.service"
import { PaymentsService } from "../services/payments/payments.service"
import { PaystackChargeSuccess } from "../services/payments/interfaces/paystack.interface"
import { CartsService } from "../carts/carts.service"
import { SubscriptionService } from "../subscription/subscription.service"
import { Subscription, SubscriptionEnum } from "../subscription/entities/subscription.entity"
import { UserService } from "../users/user.service"
import { PromotionAdsService } from "../promotion-ads/promotion-ads.service"
import { Ads, PromotionAdEnum } from "../promotion-ads/entities/promotion-ad.entity"
import { Order } from "../orders/entities/order.entity"

@Injectable()
export class WebhookService {
  constructor(
    private orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly cartsService: CartsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly promotionAdsService: PromotionAdsService
  ) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const [subscription, promotionAds, order] = await Promise.all([
      this.subscriptionService.findOne({ reference: data.reference }),
      this.promotionAdsService.findOne({ id: data.reference }),
      this.orderService.findById(data.reference)
    ])

    const isValid = await this.paymentsService.with("paystack").validatePayment(data.reference)
    if (!isValid) {
      return
    }

    if (subscription) {
      await this.handleChargeSuccessForSubscription(subscription)
      return
    } else if (promotionAds) {
      await this.handleChargeForPromotionAds(promotionAds)
      return
    }

    await this.handleChargeSuccessForOrders(order, data)
  }

  async handleChargeSuccessForSubscription(subscription: Subscription) {
    if (!subscription || subscription.status === SubscriptionEnum.ACTIVE) {
      return
    }

    const vendor = await this.userService.findOne({ id: subscription.vendorId })

    if (!vendor) return

    await this.subscriptionService.update(subscription, {
      status: SubscriptionEnum.ACTIVE
    })

    await this.userService.update(vendor, { isStarSeller: true })

    return
  }

  async handleChargeSuccessForOrders(order: Order, data: PaystackChargeSuccess) {
    if (!order || order.status === "paid") {
      return
    }

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

  async handleChargeForPromotionAds(data: Ads) {
    await this.promotionAdsService.update(data, { status: PromotionAdEnum.ACTIVE })

    console.log(data)
    return
  }
}
