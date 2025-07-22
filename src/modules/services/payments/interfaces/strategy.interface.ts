import { CreatePaystackPlan, PaymentPlanResponse } from "./paystack.interface"

export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
  validatePayment: (refrence: string) => Promise<boolean>
  createPaymentPlan: (data: CreatePaystackPlan) => Promise<PaymentPlanResponse>
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
