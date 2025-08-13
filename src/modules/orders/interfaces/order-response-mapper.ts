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
      products: data.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        images: item.product.images,
        price: item.unitPrice,
        quantity: item.quantity,
        vendor: { id: item.product.user.id, name: item.product.user.getFullName() }
      })),
      createdAt: data.paidAt?.toISOString() ?? data.createdAt.toISOString()
    }
  }
}
