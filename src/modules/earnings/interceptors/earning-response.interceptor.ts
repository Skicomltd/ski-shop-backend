import { map, Observable } from "rxjs"
import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common"

import { Earning } from "../entities/earning.entity"
import { IEarningResponse } from "../interfaces/earning-response.interface"
import { EarningResponseMapper } from "../interfaces/earning-response-mapper"

export class EarningResponseInterceptor extends EarningResponseMapper implements NestInterceptor<Earning, IEarningResponse> {
  intercept(_context: ExecutionContext, next: CallHandler<Earning>): Observable<IEarningResponse> | Promise<Observable<IEarningResponse>> {
    return next.handle().pipe(map((data) => this.transform(data)))
  }
}
