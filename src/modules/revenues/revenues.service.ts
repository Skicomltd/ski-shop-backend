import { Injectable } from "@nestjs/common"
import { SubscriptionService } from "../subscription/subscription.service"
import { OrdersService } from "../orders/orders.service"
import { AdsService } from "../ads/ads.service"
import { CombineRevenue } from "./interface/combined-revenue.interface"

@Injectable()
export class RevenuesService {
  constructor(
    private subscriptionService: SubscriptionService,
    private orderService: OrdersService,
    private adsService: AdsService
  ) {}

  async getCombineRevenue({ startDate, endDate }: CombineRevenue) {
    const [ordersRevenue, subscriptionRevenue, adsRevenue] = await Promise.all([
      this.orderService.getOrderMonthlyRevenue({ startDate, endDate, status: "paid" }),
      this.subscriptionService.getSubscriptionMonthlyRevenue({ startDate, endDate, isPaid: true }),
      this.adsService.getAdsMonthlyRevenue({ startDate, endDate, status: ["active", "expired"] })
    ])

    const combinedRevenue = [...ordersRevenue, ...subscriptionRevenue, ...adsRevenue]

    const result = Object.values(
      combinedRevenue.reduce(
        (acc, { year, month, total }) => {
          const key = `${year}-${month}`
          if (!acc[key]) {
            acc[key] = { year, month, total }
          } else {
            acc[key].total += total
          }
          return acc
        },
        {} as Record<string, { year: number; month: number; total: number }>
      )
    )

    return result.sort((a, b) => a.year - b.year || a.month - b.month)
  }
}
