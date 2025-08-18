import { Module } from "@nestjs/common"
import { SettingsService } from "./settings.service"
import { SettingsController } from "./settings.controller"
import { Play2winSettingService } from "./play2winSetting.service"
import { PromotionSettingService } from "./promotionSetting.service"
import { RevenueSettingService } from "./revenueSetting.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Setting } from "./entities/setting.entity"
import { PromotionSetting } from "./entities/promotionSetting.entity"
import { Play2winSetting } from "./entities/play2winSetting.entity"
import { RevenueSetting } from "./entities/revenueSetting.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Setting, RevenueSetting, PromotionSetting, Play2winSetting])],
  controllers: [SettingsController],
  providers: [SettingsService, Play2winSettingService, PromotionSettingService, RevenueSettingService]
})
export class SettingsModule {}
