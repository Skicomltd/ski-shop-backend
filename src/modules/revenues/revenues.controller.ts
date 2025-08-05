import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { OrdersService } from "../orders/orders.service"
import { IRevenueQuery } from "./interface/query.interface"
import { PolicyRevenueGuard } from "./guard/policy-revenue.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { AdsService } from "../ads/ads.service"

@Controller("revenues")
export class RevenuesController {
  constructor(
    private subscriptionService: SubscriptionService,
    private adsService: AdsService,
    private ordersService: OrdersService
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

    const [orders] = await this.ordersService.find({
      status: "paid",
      startDate,
      endDate
    })

    const [subscriptions] = await this.subscriptionService.find({
      isPaid: true,
      startDate,
      endDate
    })

    const [ads] = await this.adsService.find({
      status: ["active", "expired"],
      startDate,
      endDate
    })

    // Calculate amounts
    const totalOrderAmount = await this.ordersService.calculateTotalOrder(orders)

    const totalSubcriptionAmount = await this.subscriptionService.calculateTotalSubscriptions(subscriptions)

    const totalPromotionAds = await this.adsService.calculateTotalAds(ads)

    const totalRevenue = totalOrderAmount + totalSubcriptionAmount + totalPromotionAds
    return {
      order: totalOrderAmount,
      subscription: totalSubcriptionAmount,
      promotionAds: totalPromotionAds,
      totalRevenue
    }
  }

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("/sales")
  async salesOverview() {
    return await this.ordersService.getMonthlySales()
  }
}
