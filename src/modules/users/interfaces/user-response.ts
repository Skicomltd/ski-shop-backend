import { OrderStatus } from "@/modules/orders/interfaces/order-status"
import { UserRoleEnum } from "../entity/user.entity"
import { OrderDeliveryStatus } from "@/modules/orders/interfaces/delivery-status"
import { SubscriptionEnum } from "@/modules/subscription/entities/subscription.entity"

export interface IUserResponse {
  id: string
  firstName: string
  lastName: string
  role: UserRoleEnum
  email: string
  phoneNumber: string
  isEmailVerified: boolean
  createdAt: Date
  business: {
    id: string
    name: string
  }
  bank: {
    id: string
    bankName: string
    accountNumber: string
    accountName: string
  }[]
  product: {
    id: string
    name: string
    price: number
    category: string
    images: string[]
  }[]
  cart: {
    id: string
    quantity: number
  }[]
  savedProduct: {
    id: string
    productId: string
  }[]
  order: {
    id: string
    status: OrderStatus
    deliveryStatus: OrderDeliveryStatus
  }[]
  reviews: {
    id: string
    productId: string
    comment: string
  }[]
  subscriptions: {
    id: string
    startDate: Date
    endDate: Date
    planType: string
    status: SubscriptionEnum
  }[]
}
