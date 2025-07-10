import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"
import { ReviewResponseMapper } from "../interface/review-response-mapper"
import { Review } from "../entities/review.entity"
import { IReviewsResponse } from "../interface/reviews-response-interface"
import { map, Observable } from "rxjs"
import { PaginationService } from "@/modules/services/pagination/pagination.service"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { IReviewResponse } from "../interface/review-response-interface"

type PayloadType = [Review[], number]

export class ReviewsInterceptor extends ReviewResponseMapper implements NestInterceptor<PayloadType, IReviewsResponse> {
  constructor(private paginationService: PaginationService) {
    super()
  }

  intercept(context: ExecutionContext, next: CallHandler<PayloadType>): Observable<IReviewsResponse> | Promise<Observable<IReviewsResponse>> {
    const request = context.switchToHttp().getRequest()
    const { page, limit } = request.query

    return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
  }

  paginate([reviews, total]: PayloadType, params: PaginationParams): IReviewsResponse {
    const data = reviews.map((review) => this.transform(review))
    return this.paginationService.paginate<IReviewResponse>(data, total, params)
  }
}
