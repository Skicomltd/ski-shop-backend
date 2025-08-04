import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { OrdersService } from "../orders/orders.service"
import { IRevenueQuery } from "./interface/query.interface"
import { Between, In } from "typeorm"
import { PolicyRevenueGuard } from "./guard/policy-revenue.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { AdsService } from "../ads/ads.service"
import { IOrdersQuery } from "../orders/interfaces/query-filter.interface"

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
    const year = query.year || new Date().getFullYear()
    const month = query.month

    let startDate: Date
    let endDate: Date

    if (month) {
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 1)
    } else {
      startDate = new Date(year, 0, 1)
      endDate = new Date(year + 1, 0, 1)
    }

    const [orders] = await this.ordersService.find({
      status: "paid",
      createdAt: Between(startDate, endDate)
    })

    const [subscriptions] = await this.subscriptionService.find({
      isPaid: true,
      createdAt: Between(startDate, endDate)
    })

    const [ads] = await this.adsService.find({
      status: In(["active", "expired"]),
      createdAt: Between(startDate, endDate)
    })

    // Calculate amounts
    const totalOrderAmount = orders.reduce((total, order) => {
      return total + order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    }, 0)

    const totalSubcriptionAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)

    const totalPromotionAds = ads.reduce((sum, ad) => sum + ad.amount, 0)

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

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("/totalorders")
  async totalOrder(@Query() query: IOrdersQuery) {
    const now = new Date()
    const currentYear = now.getFullYear()

    const targetYear = query.year ?? currentYear

    const [startDate, endDate] =
      query.month != null
        ? [new Date(targetYear, query.month - 1, 1), new Date(targetYear, query.month, 0, 23, 59, 59)]
        : [new Date(targetYear, 0, 1), new Date(targetYear, 11, 31, 23, 59, 59)]

    return this.ordersService.totalNumberOfOrder({
      status: "paid",
      createdAt: Between(startDate, endDate)
    })
  }
}
