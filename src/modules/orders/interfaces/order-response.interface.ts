import { OrderDeliveryStatus } from "./delivery-status"
import { OrderStatus } from "./order-status"
import { PaymentMethod } from "./payment-method.interface"
import { ShippingInfo } from "./shipping-info.interface"

export interface IOrderResponse {
  id: string
  items: OrderItemResponse[]
  status: OrderStatus
  totalAmount: number
  buyer: IdName & { address: string; phoneNumber: string }
  createdAt: string
  paidAt: Date
  reference: string
  paymentMethod: PaymentMethod
  shippingInfo: ShippingInfo
}

export interface OrderItemResponse {
  id: string
  product: {
    id: string
    name: string
    images: string[]
    price: number
  }
  subtotal: number
  vendor: IdName
  quantity: number
  deliveryStatus: OrderDeliveryStatus
  deliveryNo: string | null
}
