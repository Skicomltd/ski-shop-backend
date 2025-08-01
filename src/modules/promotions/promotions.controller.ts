import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req } from "@nestjs/common"
import { PromotionsService } from "./promotions.service"
import { CreatePromotionDto, createPromotionSchema } from "./dto/create-promotion.dto"
import { UpdatePromotionDto, updatePromotionSchema } from "./dto/update-promotion.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { PolicyPromotionGuard } from "./guard/policy-promotion.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Promotion } from "./entities/promotion.entity"
import { Action } from "../services/casl/actions/action"
import { PromotionInterceptor } from "./interceptor/promotion.interceptor"
import { PromotionsInterceptor } from "./interceptor/promotions.interceptor"
import { PromotionCheckoutDto, PromotionCheckoutSchema } from "./dto/promotionCheckoutDto"
import { Request } from "express"
import { ProductsService } from "../products/products.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { PromotionAdsService } from "../promotion-ads/promotion-ads.service"
import { InitiatePayment } from "../services/payments/interfaces/strategy.interface"
import { PaymentsService } from "../services/payments/payments.service"
import { PromotionAdEnum } from "../promotion-ads/entities/promotion-ad.entity"

@Controller("promotions")
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private productService: ProductsService,
    private promotionAdsService: PromotionAdsService,
    private paymentsService: PaymentsService
  ) {}

  @UseInterceptors(PromotionInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Promotion))
  @Post()
  async create(@Body(new JoiValidationPipe(createPromotionSchema)) createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto)
  }

  @UseInterceptors(PromotionsInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Promotion))
  @Get()
  async findAll() {
    return this.promotionsService.find()
  }

  @UseInterceptors(PromotionInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Promotion))
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

    const { startDate, endDate } = await this.promotionAdsService.calculateStartAndEndDate(promotion.duration)

    const promotionAds = await this.promotionAdsService.create({
      duration: promotion.duration,
      productId: product.id,
      storeId: user.business?.store.id,
      vendorId: user.id,
      type: promotion.type,
      startDate: startDate,
      endDate: endDate,
      status: PromotionAdEnum.INACTIVE
    })

    const payload: InitiatePayment = {
      amount: promotion.amount,
      email: user.email,
      reference: promotionAds.id
    }

    // maybe a scheduler should be handled here to change the status of the promotionAds to expiry when its exipires

    return await this.paymentsService.with(checkoutDto.paymentMethod).initiatePayment(payload)
  }

  @UseInterceptors(PromotionInterceptor)
  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Promotion))
  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(updatePromotionSchema)) updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.promotionsService.findOne({ id: id })
    return await this.promotionsService.update(promotion, updatePromotionDto)
  }

  @UseGuards(PolicyPromotionGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Promotion))
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.promotionsService.remove({ id: id })
  }
}
