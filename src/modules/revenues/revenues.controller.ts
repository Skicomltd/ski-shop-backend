import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common"
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
import { Response } from "express"
import { CsvService } from "../services/utils/csv/csv.service"

@Controller("revenues")
export class RevenuesController {
  constructor(
    private subscriptionService: SubscriptionService,
    private adsService: AdsService,
    private ordersService: OrdersService,
    private storeService: StoreService,
    private revenueService: RevenuesService,
    private readonly csvService: CsvService
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

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("/store")
  async getStoreRevenueMetrics(@Query() query: IRevenueQuery) {
    const storeId = query.storeId

    const store = await this.storeService.findById(storeId)

    if (!store) throw new NotFoundException("Store does not exist")

    return await this.ordersService.getStoreRevenueMetrics(storeId)
  }

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("/trend")
  async getRevenueTrend(@Query() query: IRevenueQuery) {
    const startDate = query.startDate
    const endDate = query.endDate
    return await this.revenueService.getCombineRevenue({ startDate, endDate })
  }

  @UseGuards(PolicyRevenueGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "REVENUE"))
  @Get("download")
  async download(@Res() res: Response, @Query() query: IRevenueQuery) {
    const isPaid = query.flag === "paid"

    const [[orders], [subscriptions], [ads]] = await Promise.all([
      this.ordersService.find({ status: query.orderStatus }),
      this.subscriptionService.find({ isPaid }),
      this.adsService.find({ status: query.adsStatus })
    ])

    const headers = [
      { key: "revenueSource", header: "Revenue Source" },
      { key: "description", header: "Description" },
      { key: "amount", header: "Amount" },
      { key: "user", header: "User" },
      { key: "role", header: "Role" },
      { key: "date", header: "Date" }
    ]

    const ordersRecord = orders.flatMap((order) => {
      return order.items.map((item) => {
        return {
          revenueSource: "order",
          description: item.product.name,
          amount: item.unitPrice * item.quantity,
          user: order.buyer.getFullName(),
          role: order.buyer.role,
          date: order.createdAt.toISOString()
        }
      })
    })

    const subscriptionsRecord = subscriptions.map((sub) => {
      return {
        revenueSource: "Subscription",
        description: sub.planType,
        amount: sub.amount,
        user: sub.vendor.getFullName(),
        role: sub.vendor.role,
        date: sub.createdAt.toISOString()
      }
    })

    const adsRecord = ads.map((ad) => {
      return {
        revenueSource: "Ads",
        description: ad.promotion.name,
        amount: ad.amount,
        user: ad.product.store.business.user.getFullName(),
        date: ad.createdAt.toISOString()
      }
    })

    const records = [...ordersRecord, ...subscriptionsRecord, ...adsRecord]

    const data = await this.csvService.writeCsvToBuffer({ headers, records })

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=revenue.csv")
    res.send(data)
  }
}
