export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
  validatePayment: (refrence: string) => Promise<boolean>
  createPaymentPlan: (data: CreatePlan) => Promise<PaymentPlanResponse>
  createSubscription: (data: CreateSubscription) => Promise<SubscriptionResponse>
  getSubscription: (data: GetSubscription) => Promise<GetSubscriptionResponse>
}

export interface InitiatePayment {
  amount: number
  email: string
  currency?: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF"
  reference?: string
  callback_url?: string
  metadata?: Record<string, any>
}

export interface InitiatePaymentResponse {
  checkoutUrl: string // for web
  reference: string
  checkoutCode: string // for mobile
}

export interface SubscriptionResponse extends Partial<InitiatePayment> {
  authorization_url: string
  access_code: string
}

export interface PaymentPlanResponse {
  amount: number
  interval: string
  plan_code: string
  name: string
}

export interface CreateSubscription {
  email: string
  amount: number
  plan_code: string
}

export interface CreatePlan {
  name: string
  interval: string
  amount: number
}

export interface GetSubscriptionResponse {
  plan_code: string
  interval: string
  customer_code: string
  customer_email: string
}

export interface GetSubscription {
  code: string
}
