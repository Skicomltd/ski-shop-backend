import { Subscription, SubscriptionEnum } from "../entities/subscription.entity"

export interface ISubscriptionResponse {
  id: string
  vendorName: string
  planType: string
  startDate: Date
  endDate: Date
  status: SubscriptionEnum
  payment?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface Subscribe extends Subscription {
  payment?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}
