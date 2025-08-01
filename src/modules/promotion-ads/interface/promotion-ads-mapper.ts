import { Ads } from "../entities/promotion-ad.entity"
import { IPromotionAdsResponse } from "./promotion-ads-response.interface"

export abstract class PromotionAdsMapper implements IInterceptor {
  transform(data: Ads): IPromotionAdsResponse {
    return {
      id: data.id,
      duration: data.duration,
      type: data.type,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      product: {
        id: data.product.id,
        name: data.product.name,
        images: data.product.images
      },
      store: {
        id: data.store.id,
        name: data.store.name
      },
      vendor: {
        id: data.vendor.id,
        email: data.vendor.email,
        fullName: data.vendor.getFullName()
      }
    }
  }
}
