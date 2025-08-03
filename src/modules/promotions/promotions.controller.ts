import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { PromotionsService } from "./promotions.service"
import { CreatePromotionDto, createPromotionSchema } from "./dto/create-promotion.dto"
import { UpdatePromotionDto, updatePromotionSchema } from "./dto/update-promotion.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { PolicyPromotionGuard } from "./guard/policy-promotion.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Promotion } from "./entities/promotion.entity"
import { Action } from "../services/casl/actions/action"
import { PromotionInterceptor } from "./interceptor/promotion.interceptor"
import { PromotionsInterceptor } from "./interceptor/promotions.interceptor"

@Controller("promotions")
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @UseInterceptors(PromotionInterceptor)
  // @UseGuards(PolicyPromotionGuard)
  // @CheckPolicies((ability) => ability.can(Action.Create, Promotion))
  @Post()
  async create(@Body(new JoiValidationPipe(createPromotionSchema)) createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto)
  }

  @UseInterceptors(PromotionsInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Promotion))
  @Get()
  async findAll() {
    return this.promotionsService.find()
  }

  @UseInterceptors(PromotionInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Promotion))
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.promotionsService.findOne({ id: id })
  }

  @Post("/checkout")
  async checkout(@Body(new JoiValidationPipe(PromotionCheckoutSchema)) checkoutDto: PromotionCheckoutDto, @Req() req: Request) {
    const user = req.user

    const [product, promotion] = await Promise.all([
      this.productService.findOne({ id: checkoutDto.productId }),
      this.promotionsService.findOne({ id: checkoutDto.promotionId })
    ])

    if (!product || !promotion) throw new NotFoundException("Product or promotion does not exist")

    const promotionAdsExist = await this.promotionAdsService.findOne({
      productId: checkoutDto.productId,
      status: PromotionAdEnum.ACTIVE,
      type: promotion.type
    })

    if (promotionAdsExist) {
      throw new BadReqException(`An active promotion ad of type '${promotion.type}' already exists for this product`)
    }

    const { startDate, endDate } = await this.promotionAdsService.calculateStartAndEndDate(promotion.duration)

    const promotionAds = await this.promotionAdsService.create({
      duration: promotion.duration,
      productId: product.id,
      storeId: user.business?.store.id,
      vendorId: user.id,
      type: promotion.type,
      startDate: startDate,
      endDate: endDate,
      status: PromotionAdEnum.INACTIVE,
      amount: promotion.amount
    })

    const payload: InitiatePayment = {
      amount: promotion.amount,
      email: user.email,
      reference: promotionAds.id
    }

    // TODO: Implement a scheduler to update promotionAds status to expired when endDate is reached

    return await this.paymentsService.with(checkoutDto.paymentMethod).initiatePayment(payload)
  }

  @UseInterceptors(PromotionInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Promotion))
  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(updatePromotionSchema)) updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.promotionsService.findOne({ id: id })
    return await this.promotionsService.update(promotion, updatePromotionDto)
  }

  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Promotion))
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.promotionsService.remove({ id: id })
  }
}
