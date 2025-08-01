import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  Post
} from "@nestjs/common"
import { AdsService } from "./ads.service"
import { PolicyAdsGuard } from "./guards/policy.ads.guards"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Action } from "../services/casl/actions/action"
import { Ad } from "./entities/ad.entity"
import { AdsResponseInterceptor } from "./interceptors/ads-response.interceptor"
import { IAdsQuery } from "./interfaces/query-interface-filter"
import { AdResponseInterceptor } from "./interceptors/ad-response.interceptor"
import { UpdateAdDto } from "./dto/update-ad.dto"
// import { JoiValidationPipe } from "@/validations/joi.validation"

@Controller("ads")
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post("")
  async checkout() {
    // async checkout(@Body(new JoiValidationPipe(PromotionCheckoutSchema)) checkoutDto: PromotionCheckoutDto, @Req() req: Request) {
    // const user = req.user
    // const [product, promotion] = await Promise.all([
    //   this.productService.findOne({ id: checkoutDto.productId }),
    //   this.promotionsService.findOne({ id: checkoutDto.promotionId })
    // ])
    // if (!product || !promotion) throw new NotFoundException("Product or promotion does not exist")
    // const promotionAdsExist = await this.promotionAdsService.findOne({
    //   productId: checkoutDto.productId,
    //   status: PromotionAdEnum.ACTIVE,
    //   type: promotion.type
    // })
    // if (promotionAdsExist) {
    //   throw new BadReqException(`An active promotion ad of type '${promotion.type}' already exists for this product`)
    // }
    // const { startDate, endDate } = await this.promotionAdsService.calculateStartAndEndDate(promotion.duration)
    // const promotionAds = await this.promotionAdsService.create({
    //   duration: promotion.duration,
    //   productId: product.id,
    //   storeId: user.business?.store.id,
    //   vendorId: user.id,
    //   type: promotion.type,
    //   startDate: startDate,
    //   endDate: endDate,
    //   status: PromotionAdEnum.INACTIVE
    // })
    // const payload: InitiatePayment = {
    //   amount: promotion.amount,
    //   email: user.email,
    //   reference: promotionAds.id
    // }
    // // TODO: Implement a scheduler to update promotionAds status to expired when endDate is reached
    // return await this.paymentsService.with(checkoutDto.paymentMethod).initiatePayment(payload)
  }

  @UseGuards(PolicyAdsGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Ad))
  @UseInterceptors(AdsResponseInterceptor)
  @Get()
  findAll(@Query() query: IAdsQuery) {
    return this.adsService.find(query)
  }

  @UseGuards(PolicyAdsGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Ad))
  @UseInterceptors(AdResponseInterceptor)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adsService.findOne({ id: id })
  }

  @UseGuards(PolicyAdsGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Ad))
  @UseInterceptors(AdResponseInterceptor)
  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateAdDto: UpdateAdDto) {
    const ads = await this.adsService.findOne({ id })
    if (!ads) throw new NotFoundException("Ads could not be found")
    return this.adsService.update(ads, updateAdDto)
  }

  @UseGuards(PolicyAdsGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Ad))
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.adsService.remove({ id: id })
  }
}
