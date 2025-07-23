import { CreatePlan, CreateSubscription } from "./paystack.interface"

export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
  validatePayment: (refrence: string) => Promise<boolean>
  createPaymentPlan: (data: CreatePlan) => Promise<PaymentPlanResponse>
  createSubscription: (data: CreateSubscription) => Promise<SubscriptionResponse>
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

export interface SubscriptionResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PaymentPlanResponse {
  amount: number
  interval: string
  planCode: string
  name: string
}
