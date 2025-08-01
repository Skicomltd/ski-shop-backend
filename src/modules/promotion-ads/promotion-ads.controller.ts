import { Controller, Get, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UseGuards } from "@nestjs/common"
import { PromotionAdsService } from "./promotion-ads.service"
import { UpdatePromotionAdDto } from "./dto/update-promotion-ad.dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { IPromotionAdsQuery } from "./interface/query-interface-filter"
import { PromotionsAdsInterceptor } from "./interceptor/promotions-ads.interceptor"
import { PromotionAdsInterceptor } from "./interceptor/promotion-ads.interceptor"
import { Ads } from "./entities/promotion-ad.entity"
import { PolicyPromotionAdsGuard } from "./guard/promotionAds-policy.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"

@Controller("promotion-ads")
export class PromotionAdsController {
  constructor(private readonly promotionAdsService: PromotionAdsService) {}

  @UseGuards(PolicyPromotionAdsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Ads))
  @UseInterceptors(PromotionsAdsInterceptor)
  @Get()
  findAll(@Query() query: IPromotionAdsQuery) {
    return this.promotionAdsService.find(query)
  }

  @UseGuards(PolicyPromotionAdsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Ads))
  @UseInterceptors(PromotionAdsInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promotionAdsService.findOne({ id: id })
  }

  @UseGuards(PolicyPromotionAdsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Ads))
  @UseInterceptors(PromotionAdsInterceptor)
  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updatePromotionAdDto: UpdatePromotionAdDto) {
    const promotionAds = await this.promotionAdsService.findOne({ id: id })
    if (!promotionAds) throw new NotFoundException("Ads could not be found")
    return this.promotionAdsService.update(promotionAds, updatePromotionAdDto)
  }

  @UseGuards(PolicyPromotionAdsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Ads))
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.promotionAdsService.remove({ id: id })
  }
}
