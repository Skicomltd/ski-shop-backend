import { CouponEnumType } from "@/modules/coupons/enum/coupon-enum"

export class CreateVoucherDto {
  userId: string
  code: string
  dateWon: Date
  prizeWon: number
  prizeType: CouponEnumType
  startDate: Date
  endDate: Date
}
