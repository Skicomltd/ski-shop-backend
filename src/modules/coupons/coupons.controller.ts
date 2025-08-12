import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from "@nestjs/common"
import { CouponsService } from "./coupons.service"
import { CreateCouponDto, createCouponSchema } from "./dto/create-coupon.dto"
import { UpdateCouponDto } from "./dto/update-coupon.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { ICouponsQuery } from "./interface/query-filter.interface"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { HelpersService } from "../services/utils/helpers/helpers.service"

@Controller("coupons")
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    private helperService: HelpersService
  ) {}

  @Post()
  create(@Body(new JoiValidationPipe(createCouponSchema)) createCouponDto: CreateCouponDto) {
    createCouponDto.remainingQuantity = createCouponDto.quantity
    createCouponDto.code = this.helperService.generateCouponCode(8)
    return this.couponsService.create(createCouponDto)
  }

  @Get()
  findAll(@Query() query: ICouponsQuery) {
    return this.couponsService.find(query)
  }

  @Get("stats")
  async getStats() {
    return await this.couponsService.couponStats()
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.couponsService.findOne({ id: id })
  }

  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponsService.findById(id)
    if (!coupon) {
      throw new NotFoundException("Coupon not found")
    }
    return this.couponsService.update(coupon, updateCouponDto)
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.couponsService.remove({ id })
  }
}
