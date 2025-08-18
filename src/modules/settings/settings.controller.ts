import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, ParseUUIDPipe } from "@nestjs/common"
import { SettingsService } from "./settings.service"
import { CreateGeneralSettingsDto, createSettingSchema } from "./dto/create-setting.dto"
import { UpdateGeneralSettingDto } from "./dto/update-setting.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { RevenueSettingService } from "./revenueSetting.service"
import { PromotionSettingService } from "./promotionSetting.service"
import { Play2winSettingService } from "./play2winSetting.service"
import { SettingInterceptor } from "./interceptor/setting.interceptor"
import { PolicySettingsGuard } from "./guard/policy-settings.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Action } from "../services/casl/actions/action"
import { Setting } from "./entities/setting.entity"

@Controller("settings")
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly revenueSettingsService: RevenueSettingService,
    private readonly promotionSettingService: PromotionSettingService,
    private readonly play2winSettingService: Play2winSettingService
  ) {}

  @UseInterceptors(SettingInterceptor)
  @UseGuards(PolicySettingsGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Setting))
  @Post()
  async create(@Body(new JoiValidationPipe(createSettingSchema)) createGeneralSettingDto: CreateGeneralSettingsDto) {
    const generalSetting = await this.settingsService.create(createGeneralSettingDto.general)

    await Promise.all([
      this.revenueSettingsService.create({ ...createGeneralSettingDto.revenue, settingId: generalSetting.id, setting: generalSetting }),
      this.promotionSettingService.create({ ...createGeneralSettingDto.promotion, settingId: generalSetting.id, setting: generalSetting }),
      this.play2winSettingService.create({ ...createGeneralSettingDto.play2win, settingId: generalSetting.id, setting: generalSetting })
    ])
    return generalSetting
  }

  @UseGuards(PolicySettingsGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Setting))
  @UseInterceptors(SettingInterceptor)
  @Get("")
  async findOnesettings() {
    return await this.settingsService.findOneSetting()
  }

  @UseGuards(PolicySettingsGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Setting))
  @UseInterceptors(SettingInterceptor)
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return await this.settingsService.findOne({ id })
  }

  @UseGuards(PolicySettingsGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Setting))
  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateGeneralSettingDto: UpdateGeneralSettingDto) {
    const setting = await this.settingsService.findById(id)
    if (updateGeneralSettingDto.general) {
      this.settingsService.update(setting, updateGeneralSettingDto.general)
    }

    if (updateGeneralSettingDto.revenue) {
      const revenueSetting = await this.revenueSettingsService.findOne({ settingId: setting.id })
      await this.revenueSettingsService.update(revenueSetting, updateGeneralSettingDto.revenue)
    }

    if (updateGeneralSettingDto.promotion) {
      const promotionSetting = await this.promotionSettingService.findOne({ settingId: setting.id })
      await this.promotionSettingService.update(promotionSetting, updateGeneralSettingDto.promotion)
    }

    if (updateGeneralSettingDto.play2win) {
      const play2winSetting = await this.play2winSettingService.findOne({ settingId: setting.id })
      await this.play2winSettingService.update(play2winSetting, updateGeneralSettingDto.play2win)
    }

    return "Settings updated successfully"
  }

  @UseGuards(PolicySettingsGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Setting))
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.settingsService.remove({ id })
  }
}
