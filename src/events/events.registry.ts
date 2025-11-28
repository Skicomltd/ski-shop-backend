export const EventRegistry = {
  CREATE_NOTIFICATION: "notification.create",

  ORDER_PLACED: "order.placed",
  ORDER_PALCED_VENDOR: "order.placed.vendor",
  ORDER_PALCED_CUSTOMER: "order.placed.customer",

  ORDER_DELIVERY_REQUESTED: "order.delivery.requested",
  ORDER_DELIVERY_REQUESTED_VENDOR: "order.delivery.requested.vendor",
  ORDER_DELIVERY_REQUESTED_CUSTOMER: "order.delivery.requested.customer"
} as const

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry]
