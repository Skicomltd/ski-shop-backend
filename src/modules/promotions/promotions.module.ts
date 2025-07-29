import { Module } from "@nestjs/common"
import { PromotionsService } from "./promotions.service"
import { PromotionsController } from "./promotions.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Promotion } from "./entities/promotion.entity"
import { ProductsModule } from "../products/products.module"
import { PromotionAdsModule } from "../promotion-ads/promotion-ads.module"

@Module({
  imports: [TypeOrmModule.forFeature([Promotion]), ProductsModule, PromotionAdsModule],
  controllers: [PromotionsController],
  providers: [PromotionsService]
})
export class PromotionsModule {}
