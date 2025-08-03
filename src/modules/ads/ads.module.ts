import { Module } from "@nestjs/common"
import { AdsService } from "./ads.service"
import { AdsController } from "./ads.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Ad } from "./entities/ad.entity"
import { ProductsModule } from "../products/products.module"
import { PromotionsModule } from "../promotions/promotions.module"

@Module({
  imports: [TypeOrmModule.forFeature([Ad]), ProductsModule, PromotionsModule],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService]
})
export class AdsModule {}
