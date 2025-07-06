import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { OrderResponseMapper } from "../interfaces/order-response-mapper"
import { Order } from "../entities/order.entity"
import { IOrdersResponse } from "../interfaces/orders-response.interface"
import { map, Observable } from "rxjs"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { IOrderResponse } from "../interfaces/order-response.interface"
import { PaginationService } from "@/modules/services/pagination/pagination.service"

type PayloadType = [Order[], number]

@Injectable()
export class OrdersInterceptor extends OrderResponseMapper implements NestInterceptor<PayloadType, IOrdersResponse> {
  constructor(private paginationService: PaginationService) {
    super()
  }

  intercept(context: ExecutionContext, next: CallHandler<PayloadType>): Observable<IOrdersResponse> | Promise<Observable<IOrdersResponse>> {
    const request = context.switchToHttp().getRequest()
    const { page, limit } = request.query

    return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
  }

  paginate([orders, total]: PayloadType, params: PaginationParams): IOrdersResponse {
    const data = orders.map((order) => this.transform(order))
    return this.paginationService.paginate<IOrderResponse>(data, total, params)
  }
}
