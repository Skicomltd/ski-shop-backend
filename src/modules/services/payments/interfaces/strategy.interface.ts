export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
  validatePayment: (refrence: string) => Promise<boolean>
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
  checkoutUrl: string
  reference: string
}
