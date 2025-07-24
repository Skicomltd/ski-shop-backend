import { Subscription } from "../entities/subscription.entity"
import { ISubscriptionResponse } from "./subscription-response.interface"

export abstract class SubscriptionResponseMapper implements IInterceptor {
  transform(data: Subscription): ISubscriptionResponse {
    return {
      id: data.id,
      vendorName: data.vendor?.business.store.name,
      startDate: data.startDate,
      endDate: data.endDate,
      planType: data.planType,
      status: data.status
    }
  }
}
