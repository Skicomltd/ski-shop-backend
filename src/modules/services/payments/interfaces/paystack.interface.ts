export type PaystackEventType = "charge.success"
type PaystackWebhookBody<T> = PaystackChargeSuccess<T>

export type PaystackWebhook<T = any> = {
  event: PaystackEventType
  data: PaystackWebhookBody<T>
}

export type PaystackChargeSuccess<T = any> = {
  id: number
  domain: string
  status: string
  reference: string
  amount: number
  message: string | null
  gateway_response: string
  paid_at: string
  created_at: string
  channel: string
  currency: string
  ip_address: string
  metadata: any
  fees_breakdown: any | null
  log: any | null
  fees: number
  fees_split: any | null
  authorization: {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    channel: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    reusable: boolean
    signature: string
    account_name: string | null
  }
  customer: {
    id: number
    first_name: string | null
    last_name: string | null
    email: string
    customer_code: string
    phone: string | null
    metadata: T
    risk_action: string
    international_format_phone: string | null
  }
  plan: Record<string, unknown>
  subaccount: Record<string, unknown>
  split: Record<string, unknown>
  order_id: string | null
  paidAt: string
  requested_amount: number
  pos_transaction_data: any | null
  source: {
    type: string
    source: string
    entry_point: string
    identifier: string | null
  }
}

export interface PaystackApiResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface PaystackInitiatePaymentResponse
  extends PaystackApiResponse<{
    authorization_url: string
    access_code: string
    reference: string
  }> {}

export type PaystackPaymentStatus = "abandoned" | "failed" | "ongoing" | "pending" | "processing" | "queued" | "reversed" | "success"

export interface PaystackTransactionVerification
  extends PaystackApiResponse<{
    id: number
    domain: string
    status: PaystackPaymentStatus
    reference: string
    receipt_number: string | null
    amount: number
    message: string | null
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: any // Could be string or object depending on usage
    log: {
      start_time: number
      time_spent: number
      attempts: number
      errors: number
      success: boolean
      mobile: boolean
      input: any[]
      history: {
        type: string
        message: string
        time: number
      }[]
    } | null
    fees: number
    fees_split: any | null
    authorization: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name: string | null
    }
    customer: {
      id: number
      first_name: string | null
      last_name: string | null
      email: string
      customer_code: string
      phone: string | null
      metadata: any
      risk_action: string
      international_format_phone: string | null
    }
    plan: any | null
    split: any
    order_id: string | null
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any | null
    source: any | null
    fees_breakdown: any | null
    connect: any | null
    transaction_date: string
    plan_object: any
    subaccount: any
  }> {}
