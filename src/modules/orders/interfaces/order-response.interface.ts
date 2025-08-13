import { OrderStatus } from "./order-status"
import { PaymentMethod } from "./payment-method.interface"

export interface IOrderResponse {
  id: string
  products: OrderItemResponse[]
  status: OrderStatus
  buyer: IdName & { address: string; phone: string }
  createdAt: string
  paidAt: Date
  reference: string
  paymentMethod: PaymentMethod
}

export interface OrderItemResponse {
  id: string
  name: string
  images: string[]
  price: number
  subtotal: number
  vendor: IdName
  quantity: number
}
