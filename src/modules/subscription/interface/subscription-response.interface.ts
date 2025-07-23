import { SubscriptionEnum } from "../entities/subscription.entity"

export interface ISubscriptionResponse {
  id: string
  vendorName: string
  planType: string
  startDate: Date
  endDate: Date
  status: SubscriptionEnum
}
