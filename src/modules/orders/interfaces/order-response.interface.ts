import { OrderStatus } from "./order-status"

export interface IOrderResponse {
  id: string
  items: OrderItemResponse[]
  status: OrderStatus
  buyer: IdName
  createdAt: string
}

export interface OrderItemResponse {
  name: string
  images: string[]
  price: number
  quantity: number
}
