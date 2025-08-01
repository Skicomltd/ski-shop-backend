import { PromotionTypeEnum } from "@/modules/promotions/entities/promotion.entity"
import { AdStatus } from "../interfaces/ad-status.interface"

export class CreateAdDto {
  duration: number
  vendorId: string
  storeId: string
  productId: string
  type: PromotionTypeEnum
  startDate: Date
  endDate: Date
  status: AdStatus
}
