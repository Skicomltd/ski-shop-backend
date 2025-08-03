import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { map, Observable } from "rxjs"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { PaginationService } from "@/modules/services/pagination/pagination.service"
import { PayoutResponseMapper } from "../interfaces/payout-response-mapper"
import { Payout } from "../entities/payout.entity"
import { IPayoutResponses } from "../interfaces/payout-responses.interface"
import { IPayoutResponse } from "../interfaces/payout-response.interface"

type PayloadType = [Payout[], number]

@Injectable()
export class PayoutResponsesInterceptor extends PayoutResponseMapper implements NestInterceptor<PayloadType, IPayoutResponses> {
  constructor(private paginationService: PaginationService) {
    super()
  }

  intercept(context: ExecutionContext, next: CallHandler<PayloadType>): Observable<IPayoutResponses> | Promise<Observable<IPayoutResponses>> {
    const request = context.switchToHttp().getRequest()
    const { page, limit } = request.query

    return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
  }

  paginate([payouts, total]: PayloadType, params: PaginationParams): IPayoutResponses {
    const data = payouts.map((payout) => this.transform(payout))
    return this.paginationService.paginate<IPayoutResponse>(data, total, params)
  }
}
