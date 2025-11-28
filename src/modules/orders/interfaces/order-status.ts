export const ORDER_STATUS = ["unpaid", "paid", "pending", "partially_paid"] as const

export type OrderStatus = (typeof ORDER_STATUS)[number]
