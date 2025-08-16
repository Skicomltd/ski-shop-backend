import { Injectable } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { ProductsService } from "../products/products.service"
import { OrdersService } from "../orders/orders.service"
import { PayoutsService } from "../payouts/payouts.service"
import { WithdrawalsService } from "../withdrawals/withdrawals.service"
import { User } from "../users/entity/user.entity"
import { ProductStatusEnum } from "../common/types"
import { VendorProfile } from "./interface/vendor-profile.interface"

@Injectable()
export class ProfilesService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly productService: ProductsService,
    private readonly orderService: OrdersService,
    private readonly payoutsService: PayoutsService,
    private readonly withdrawalsService: WithdrawalsService
  ) {}

  async populateSubscriptionData(user: User, profile: VendorProfile): Promise<void> {
    const latestSubscription = await this.subscriptionService.findLatestByUserId(user.id)
    if (latestSubscription) {
      profile.subscription = {
        status: latestSubscription.status || "inactive",
        planType: latestSubscription.planType || "",
        paymentStatus: latestSubscription.isPaid ? "paid" : "unpaid",
        startDate: latestSubscription.startDate || null,
        endDate: latestSubscription.endDate || null
      }
      profile.profile.subscription = latestSubscription.status || "inactive"
    }
  }

  async populateStoreData(storeId: string, profile: VendorProfile): Promise<void> {
    const [productCounts, orders, refinedOrders] = await Promise.all([
      this.productService.getProductCounts(storeId, ProductStatusEnum.published),
      this.orderService.getStoreRevenueMetrics(storeId),
      this.orderService.getStoreOrders(storeId)
    ])

    if (productCounts) {
      profile.product.totalProduct = productCounts.totalProduct || 0
      profile.product.totalPublishedProduct = productCounts.totalPublishedOrDraftProduct || 0
    }

    if (orders) {
      profile.product.totalOrder = orders.totalOrder || 0
      profile.product.totalSales = orders.totalSales || 0
      profile.product.averageOrderValue = orders.averageOrderValue || 0
    }

    profile.order = refinedOrders || []
  }

  async populatePayoutData(storeId: string, profile: VendorProfile): Promise<void> {
    const payouts = await this.payoutsService.findOne({ storeId })
    if (payouts) {
      profile.payout.walletBalance = payouts.available || 0
      profile.payout.totalWithdrawal = payouts.withdrawals?.length || 0

      const withdrawalStats = await this.withdrawalsService.getWithdrawalStats(payouts.id)
      if (withdrawalStats) {
        profile.payout.pendingWithdrawal = withdrawalStats.pendingWithdrawalCount || 0
        profile.payout.lastPayout = withdrawalStats.lastPayout || null
      }
    }
  }

  async initializeProfile(user: User): Promise<VendorProfile> {
    return {
      profile: {
        storeName: user.business?.store?.name || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        kycStatus: user.business?.kycStatus || "unverified",
        subscription: "inactive",
        dateJoin: user.createdAt
      },
      business: {
        name: user.business?.name || "",
        cacRegNo: user.business?.businessRegNumber || "",
        kycType: user.business?.kycVerificationType || "",
        identificationNumber: user.business?.identificationNumber || ""
      },
      subscription: {
        status: "inactive",
        planType: "",
        paymentStatus: "unpaid",
        startDate: null,
        endDate: null
      },
      product: {
        totalProduct: 0,
        totalPublishedProduct: 0,
        totalOrder: 0,
        totalSales: 0,
        averageOrderValue: 0
      },
      payout: {
        walletBalance: 0,
        totalWithdrawal: 0,
        pendingWithdrawal: 0,
        lastPayout: null
      },
      order: []
    }
  }
}
