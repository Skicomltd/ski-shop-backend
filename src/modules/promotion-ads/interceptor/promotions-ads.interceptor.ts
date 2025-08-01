import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { map, Observable } from "rxjs"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

import { PaginationService } from "@/modules/services/pagination/pagination.service"
import { Ads } from "../entities/promotion-ad.entity"
import { PromotionAdsMapper } from "../interface/promotion-ads-mapper"
import { IPromotionsAdsResponse } from "../interface/promotions-ads.interface"
import { IPromotionAdsResponse } from "../interface/promotion-ads-response.interface"

type PayloadType = [Ads[], number]

@Injectable()
export class PromotionsAdsInterceptor extends PromotionAdsMapper implements NestInterceptor<PayloadType, IPromotionsAdsResponse> {
  constructor(private paginationService: PaginationService) {
    super()
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<PayloadType>
  ): Observable<IPromotionsAdsResponse> | Promise<Observable<IPromotionsAdsResponse>> {
    const request = context.switchToHttp().getRequest()
    const { page, limit } = request.query

    return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
  }

  paginate([promotionsAds, total]: PayloadType, params: PaginationParams): IPromotionsAdsResponse {
    const data = promotionsAds.map((promotionAds) => this.transform(promotionAds))
    return this.paginationService.paginate<IPromotionAdsResponse>(data, total, params)
  }
}
