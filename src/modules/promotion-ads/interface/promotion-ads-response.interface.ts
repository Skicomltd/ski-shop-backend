import { PromotionTypeEnum } from "@/modules/promotions/entities/promotion.entity"
import { PromotionAdEnum } from "../entities/promotion-ad.entity"

export interface IPromotionAdsResponse {
  id: string
  type: PromotionTypeEnum
  status: PromotionAdEnum
  startDate: Date
  endDate: Date
  duration: number
  vendor: {
    id: string
    fullName: string
    email: string
  }
  store: {
    id: string
    name: string
  }
  product: {
    id: string
    name: string
    images: string[]
  }
}
