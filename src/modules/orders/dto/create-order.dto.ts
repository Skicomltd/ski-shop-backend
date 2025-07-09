import { OrderStatus } from "../interfaces/order-status"

export class CreateOrderDto {
  status?: OrderStatus
  paymentStatus?: OrderStatus
  buyerId: string
  items: Array<{
    quantity: number
    unitPrice: number
    productId: string
    storeId: string
  }>
}
