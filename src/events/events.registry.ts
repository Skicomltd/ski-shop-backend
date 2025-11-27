export const EventRegistry = {
  CREATE_NOTIFICATION: "notification.create",
  ORDER_PLACED: "order.placed",
  ORDER_PALCED_VENDOR: "order.placed.vendor",
  ORDER_PALCED_CUSTOMER: "order.placed.customer"
} as const

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry]
