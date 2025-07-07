export const ORDER_STATUS = ["unpaid", "paid", "pending", "delivered"] as const

export type OrderStatus = (typeof ORDER_STATUS)[number]
