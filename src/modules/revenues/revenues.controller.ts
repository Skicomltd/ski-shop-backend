import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { OrdersService } from "../orders/orders.service"
import { IRevenueQuery } from "./interface/query.interface"
import { PolicyRevenueGuard } from "./guard/policy-revenue.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { AdsService } from "../ads/ads.service"
import { StoreService } from "../stores/store.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { RevenuesService } from "./revenues.service"

@Controller("revenues")
export class RevenuesController {
  constructor(
    private subscriptionService: SubscriptionService,
    private adsService: AdsService,
    private ordersService: OrdersService,
    private storeService: StoreService,
    private revenueService: RevenuesService
  ) {}

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("")
  async totalRevenue(@Query() query: IRevenueQuery) {
    let startDate: Date
    let endDate: Date

    if (query.startDate) {
      startDate = query.startDate
    }

    if (query.endDate) {
      endDate = query.endDate
    }

    const totalPromotionAds = await this.adsService.calculateAdsTotalRevenue({ startDate, endDate, status: ["active", "expired"] })

    const totalSubcriptionAmount = await this.subscriptionService.calculateSubscriptionsTotalRevenue({ startDate, endDate, isPaid: true })

    const totalOrderAmount = await this.ordersService.calculateOrdersTotalRevenue({ startDate, endDate, status: "paid" })

    const totalRevenue = totalOrderAmount + totalSubcriptionAmount + totalPromotionAds

    return {
      orders: totalOrderAmount,
      subscriptions: totalSubcriptionAmount,
      promotionAds: totalPromotionAds,
      totalRevenue
    }
  }

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("/sales")
  async salesOverview(@Query() query: IRevenueQuery) {
    return await this.ordersService.getOrderMonthlyRevenue({ startDate: query.startDate, endDate: query.endDate, status: "paid" })
  }

  @Get("/store")
  async getStoreRevenueMetrics(@Query() query: IRevenueQuery) {
    const storeId = query.storeId

    const store = await this.storeService.findById(storeId)

    if (!store) throw new NotFoundException("Store does not exist")

    return await this.ordersService.getStoreRevenueMetrics(storeId)
  }

  @Get("/trend")
  async getRevenueTrend(@Query() query: IRevenueQuery) {
    const startDate = query.startDate
    const endDate = query.endDate
    return await this.revenueService.getCombineRevenue({ startDate, endDate })
  }
}
