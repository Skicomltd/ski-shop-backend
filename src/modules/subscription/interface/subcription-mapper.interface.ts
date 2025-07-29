import { ISubscriptionResponse, Subscribe } from "./subscription-response.interface"

export abstract class SubscriptionResponseMapper implements IInterceptor {
  transform(data: Subscribe): ISubscriptionResponse {
    return {
      id: data.id,
      vendorName: data.vendor?.business.store.name,
      startDate: data.startDate,
      endDate: data.endDate,
      planType: data.planType,
      status: data.status,
      payment: {
        access_code: data.payment?.access_code,
        authorization_url: data.payment?.authorization_url,
        reference: data.payment?.reference
      }
    }
  }
}
