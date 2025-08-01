import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors } from "@nestjs/common"
import { PromotionAdsService } from "./promotion-ads.service"
import { CreatePromotionAdDto } from "./dto/create-promotion-ad.dto"
import { UpdatePromotionAdDto } from "./dto/update-promotion-ad.dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { IPromotionAdsQuery } from "./interface/query-interface-filter"
import { PromotionsAdsInterceptor } from "./interceptor/promotions-ads.interceptor"
import { PromotionAdsInterceptor } from "./interceptor/promotion-ads.interceptor"

@Controller("promotion-ads")
export class PromotionAdsController {
  constructor(private readonly promotionAdsService: PromotionAdsService) {}

  @Post()
  create(@Body() createPromotionAdDto: CreatePromotionAdDto) {
    return this.promotionAdsService.create(createPromotionAdDto)
  }

  @UseInterceptors(PromotionsAdsInterceptor)
  @Get()
  findAll(@Query() query: IPromotionAdsQuery) {
    return this.promotionAdsService.find(query)
  }

  @UseInterceptors(PromotionAdsInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promotionAdsService.findOne({ id: id })
  }

  @UseInterceptors(PromotionAdsInterceptor)
  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updatePromotionAdDto: UpdatePromotionAdDto) {
    const promotionAds = await this.promotionAdsService.findOne({ id: id })
    if (!promotionAds) throw new NotFoundException("Ads could not be found")
    return this.promotionAdsService.update(promotionAds, updatePromotionAdDto)
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.promotionAdsService.remove({ id: id })
  }
}
