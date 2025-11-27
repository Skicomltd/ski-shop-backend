export const PAYMENT_METHODS = ["paystack", "paymentOnDelivery"] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
