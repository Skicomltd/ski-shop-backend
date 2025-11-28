import { Injectable } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"

import { Ad } from "../ads/entities/ad.entity"
import { AdsService } from "../ads/ads.service"
import { UserService } from "../users/user.service"
import { StoreService } from "../stores/store.service"
import { Order } from "../orders/entities/order.entity"
import { OrdersService } from "../orders/orders.service"
import { PayoutsService } from "../payouts/payouts.service"
import { vendonEnumType } from "../stores/entities/store.entity"
import { WithdrawalsService } from "../withdrawals/withdrawals.service"
import { SubscriptionService } from "../subscription/subscription.service"
import { Subscription, SubscriptionEnum } from "../subscription/entities/subscription.entity"

import { EventRegistry } from "@/events/events.registry"
import { PaymentsService } from "@services/payments/payments.service"
import { TransactionHelper } from "@services/utils/transactions/transactions.service"
import { PaystackChargeSuccess, PaystackTransferData } from "@services/payments/interfaces/paystack.interface"

@Injectable()
export class WebhookService {
  constructor(
    private orderService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly adsService: AdsService,
    private readonly transactionHelper: TransactionHelper,
    private readonly withdrawalsService: WithdrawalsService,
    private readonly payoutsService: PayoutsService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async handleChargeSuccess(data: PaystackChargeSuccess) {
    const isValid = await this.paymentsService.with("paystack").validatePayment(data.reference)
    if (!isValid) return

    const [subscription, ads, order] = await Promise.all([
      this.subscriptionService.findOne({ reference: data.reference }),
      this.adsService.findOne({ reference: data.reference }),
      this.orderService.findOne({ reference: data.reference })
    ])

    if (!subscription && !ads && !order) return

    if (subscription) {
      await this.handleChargeSuccessForSubscription(subscription)
    }

    if (ads) {
      await this.handleChargeForAds(ads)
    }

    if (order) {
      await this.handleChargeSuccessForOrders(order)
    }
  }

  async handleChargeSuccessForSubscription(subscription: Subscription) {
    if (!subscription || subscription.status === SubscriptionEnum.ACTIVE) {
      return
    }

    const vendor = await this.userService.findOne({ id: subscription.vendorId })

    if (!vendor) return

    const { startDate, endDate } = await this.subscriptionService.getStartAndEndDate(subscription.planType.toLowerCase())

    const updatedSubscription = await this.subscriptionService.update(subscription, {
      status: SubscriptionEnum.ACTIVE,
      isPaid: true,
      startDate,
      endDate
    })

    // dispatch job to end subscription
    await this.subscriptionService.dispatch({ name: subscription.id, data: updatedSubscription })

    const store = await this.storeService.findOne({ id: vendor.business.store.id })

    if (!store) {
      return
    }

    await this.storeService.update(store, { isStarSeller: true, type: vendonEnumType.PREMIUM })

    return
  }

  async handleChargeSuccessForOrders(order: Order) {
    if (!order || order.status === "paid") {
      return
    }

    // Delete the user Cart -> cart controller
    // Update order status to paid and send notification to vendors and customer -> order controller
    // Redeem voucher -> voucher controller
    // Update buyer order count -> user controller
    // For each order item:
    //    - update each store number of sales -> store controller
    //    - Increment store payout balance -> payout controller
    //    - Keep record of skicom's commission -> commmision controller
    //    - update vendor order count -> user controller
    this.eventEmitter.emit(EventRegistry.ORDER_PLACED, order)
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
      subscriptionCode: data.subscription.subscription_code,
      isPaid: false
    })
  }

  async handleTransferSuccess(data: PaystackTransferData) {
    const withdrawal = await this.withdrawalsService.findById(data.reference)
    if (!withdrawal) return

    // why are we here exactly?
    if (withdrawal.status !== "pending") return

    return this.transactionHelper.runInTransaction(async (manager) => {
      const successDto = withdrawal.payout.handleWithdrawSuccess(withdrawal.amount)
      await this.payoutsService.update(withdrawal.payout, successDto, manager)
      await this.withdrawalsService.update(withdrawal, { status: "success" }, manager)
    })
  }

  async handleTransferFailed(data: PaystackTransferData) {
    const withdrawal = await this.withdrawalsService.findById(data.reference)
    if (!withdrawal) return

    // why are we here exactly?
    if (withdrawal.status !== "pending") return

    return this.transactionHelper.runInTransaction(async (manager) => {
      await this.payoutsService.update(withdrawal.payout, withdrawal.payout.handleWithdrawFailed(withdrawal.amount), manager)
      await this.withdrawalsService.update(withdrawal, { status: "failed" }, manager)
    })
  }

  async handleChargeForAds(data: Ad) {
    const { startDate, endDate } = await this.adsService.calculateStartAndEndDate(data.duration)
    const updated = await this.adsService.update(data, { status: "active", startDate, endDate })
    await this.adsService.dispatch({ name: data.id, data: updated })
    return
  }
}
