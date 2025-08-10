import { CouponEnumType } from "../enum/coupon-enum"
import * as joi from "joi"

export class CreateCouponDto {
  title: string
  code: number
  quantity: number
  couponType: CouponEnumType
  value: number
  startDate: Date
  endDate: Date
}

export const createCouponSchema = joi.object({
  title: joi.string().required(),
  code: joi.number().required(),
  couponType: joi.string().valid(["percentage", "amount"]).required(),
  value: joi.number().required,
  startDate: joi.date().required(),
  endDate: joi.date().required()
})
