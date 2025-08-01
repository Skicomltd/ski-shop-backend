import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { PromotionAdsMapper } from "../interface/promotion-ads-mapper"
import { Ads } from "../entities/promotion-ad.entity"
import { IPromotionAdsResponse } from "../interface/promotion-ads-response.interface"
import { map, Observable } from "rxjs"

@Injectable()
export class PromotionAdsInterceptor extends PromotionAdsMapper implements NestInterceptor<Ads, IPromotionAdsResponse> {
  intercept(__context: ExecutionContext, next: CallHandler<Ads>): Observable<IPromotionAdsResponse> | Promise<Observable<IPromotionAdsResponse>> {
    return next.handle().pipe(map((data) => this.transform(data)))
  }
}
