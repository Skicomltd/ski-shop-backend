import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { PromotionAdsService } from "../promotion-ads/promotion-ads.service"
import { OrdersService } from "../orders/orders.service"
import { PromotionAdEnum } from "../promotion-ads/entities/promotion-ad.entity"
import { IRevenueQuery } from "./interface/query.interface"
import { Between, In } from "typeorm"
import { PolicyRevenueGuard } from "./guard/policy-revenue.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"

@Controller("revenue")
export class RevenueController {
  constructor(
    private subscriptionService: SubscriptionService,
    private promotionAdsService: PromotionAdsService,
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

    const [promotionAds] = await this.promotionAdsService.find({
      status: In([PromotionAdEnum.ACTIVE, PromotionAdEnum.EXPIRED]),
      createdAt: Between(startDate, endDate)
    })

    // Calculate amounts
    const totalOrderAmount = orders.reduce((total, order) => {
      return total + order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    }, 0)

    const totalSubcriptionAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)

    const totalPromotionAds = promotionAds.reduce((sum, ad) => sum + ad.amount, 0)

    const totalRevenue = totalOrderAmount + totalSubcriptionAmount + totalPromotionAds
    return {
      order: totalOrderAmount,
      subscription: totalSubcriptionAmount,
      promotionAds: totalPromotionAds,
      totalRevenue
    }
  }
}
