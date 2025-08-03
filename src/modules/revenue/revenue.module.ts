import { Module } from "@nestjs/common"
import { RevenueService } from "./revenue.service"
import { RevenueController } from "./revenue.controller"
import { OrdersModule } from "../orders/orders.module"
import { PromotionAdsModule } from "../promotion-ads/promotion-ads.module"
import { SubscriptionModule } from "../subscription/subscription.module"

@Module({
  imports: [OrdersModule, PromotionAdsModule, SubscriptionModule],
  controllers: [RevenueController],
  providers: [RevenueService]
})
export class RevenueModule {}
