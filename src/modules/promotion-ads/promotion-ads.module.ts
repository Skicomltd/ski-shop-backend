import { Module } from "@nestjs/common"
import { PromotionAdsService } from "./promotion-ads.service"
import { PromotionAdsController } from "./promotion-ads.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Ads } from "./entities/promotion-ad.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Ads])],
  controllers: [PromotionAdsController],
  providers: [PromotionAdsService],
  exports: [PromotionAdsService]
})
export class PromotionAdsModule {}
