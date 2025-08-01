import { PromotionTypeEnum } from "@/modules/promotions/entities/promotion.entity"
import { PromotionAdEnum } from "../entities/promotion-ad.entity"

export class CreatePromotionAdDto {
  duration: number
  vendorId: string
  storeId: string
  productId: string
  type: PromotionTypeEnum
  startDate: Date
  endDate: Date
  status: PromotionAdEnum
}
