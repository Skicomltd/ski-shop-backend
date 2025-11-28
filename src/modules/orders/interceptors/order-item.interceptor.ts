import { map, Observable } from "rxjs"
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"

import { OrderItem } from "../entities/order-item.entity"
import { OrderItemResponse } from "../interfaces/order-response.interface"

@Injectable()
export class OrderItemInterceptor implements NestInterceptor<OrderItem, OrderItemResponse> {
  intercept(_context: ExecutionContext, next: CallHandler<OrderItem>): Observable<OrderItemResponse> | Promise<Observable<OrderItemResponse>> {
    return next.handle().pipe(
      map((data) => ({
        id: data.product.id,
        name: data.product.name,
        images: data.product.images,
        price: data.unitPrice,
        subtotal: data.unitPrice * data.quantity,
        quantity: data.quantity,
        deliveryStatus: data.deliveryStatus,
        deliveryNo: data.deliveryNo,
        vendor: { id: data.product.user.id, name: data.product.user.getFullName() }
      }))
    )
  }
}
