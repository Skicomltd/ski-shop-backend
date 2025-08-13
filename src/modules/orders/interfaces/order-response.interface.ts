import { OrderStatus } from "./order-status"

export interface IOrderResponse {
  id: string
  products: OrderItemResponse[]
  status: OrderStatus
  buyer: IdName
  createdAt: string
}

export interface OrderItemResponse {
  id: string
  name: string
  images: string[]
  price: number
  vendor: IdName
  quantity: number
}
