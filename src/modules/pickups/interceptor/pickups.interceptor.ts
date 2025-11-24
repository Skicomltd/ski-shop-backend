import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { PickupResponseMapper } from "../interface/pickup-response-mapper"
import { Pickup } from "../entities/pickup.entity"
import { IPickupsResponse } from "../interface/pickups-response.interface"
import { map, Observable } from "rxjs"
import { PaginationService } from "@/services/pagination"
import { IPickupResponse } from "../interface/pickup-response.interface"

type Payload = [Pickup[], number]

@Injectable()
export class PickupsResponseInterceptor extends PickupResponseMapper implements NestInterceptor<Payload, IPickupsResponse> {
  constructor(private paginationService: PaginationService) {
    super()
  }

  intercept(context: ExecutionContext, next: CallHandler<Payload>): Observable<IPickupsResponse> | Promise<Observable<IPickupsResponse>> {
    const request = context.switchToHttp().getRequest()
    const { page, limit } = request.query

    return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
  }

  paginate([pickups, total]: Payload, params: { page: number; limit: number }): IPickupsResponse {
    const data = pickups.map((pickup) => this.transform(pickup))
    return this.paginationService.paginate<IPickupResponse>(data, total, params)
  }
}
