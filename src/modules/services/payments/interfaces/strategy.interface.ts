export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
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

export interface PaystackInitiatePaymentResponse {
  status: true
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}
