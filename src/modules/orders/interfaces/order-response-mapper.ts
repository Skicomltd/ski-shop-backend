import { Order } from "../entities/order.entity"
import { IOrderResponse } from "./order-response.interface"

export abstract class OrderResponseMapper implements IInterceptor {
  transform(data: Order): IOrderResponse {
    return {
      id: data.id,
      status: data.status,
      buyer: {
        id: data.buyer.id,
        name: data.buyer.getFullName()
      },
      items: data.items.map((item) => ({
        name: item.product.name,
        images: item.product.images,
        price: item.unitPrice,
        quantity: item.quantity
      })),
      createdAt: data.paidAt?.toISOString() ?? data.createdAt.toISOString()
    }
  }
}
