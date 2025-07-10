import { OrderStatus } from "../interfaces/order-status"
import { PaymentMethod } from "../interfaces/payment-method.interface"

export class CreateOrderDto {
  status?: OrderStatus
  paymentStatus?: OrderStatus
  paymentMethod: PaymentMethod
  buyerId: string
  items: Array<{
    quantity: number
    unitPrice: number
    productId: string
    storeId: string
  }>
}
