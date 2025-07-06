export const PAYMENT_METHODS = ["transfer", "paystack"] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
