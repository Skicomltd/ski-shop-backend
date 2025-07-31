export interface IPaymentService {
  initiatePayment: (data: InitiatePayment) => Promise<InitiatePaymentResponse>
  validatePayment: (refrence: string) => Promise<boolean>
  createPaymentPlan: (data: CreatePlan) => Promise<PaymentPlanResponse>
  createSubscription: (data: CreateSubscription) => Promise<SubscriptionResponse>
  getSubscription: (data: GetSubscription) => Promise<GetSubscriptionResponse>
  checkBalance: () => Promise<CheckBalance>
  getBanks: (currency?: Currency) => Promise<Bank[]>
  createTransferRecipient: (data: CreateTransferRecipient) => Promise<CreateTransferRecipientResponse>
  transfer(data: Transfer): Promise<void>
}

export type Transfer = {
  amount: number
  reference: string
  recipient: string
  reason: string
  currency?: Currency
}

export type CreateTransferRecipient = {
  type?: string
  name: string
  accountNumber: string
  bankCode: string
  currency?: Currency
  description?: string
  metadata?: Record<string, any>
}

export type CreateTransferRecipientResponse = {
  code: string
  name: string
}

type Bank = {
  name: string
  code: string
}

export type GetBanks = Bank[]

export type Currency = "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF"

export interface InitiatePayment {
  amount: number
  email: string
  currency?: Currency
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

export interface CheckBalance {
  amount: number
  currency: Currency
}
