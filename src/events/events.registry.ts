export const EventRegistry = {
  CREATE_NOTIFICATION: "notification.create",

  ORDER_PLACED_PAID: "order.placed.paid",
  ORDER_PLACED_POD: "order.placed.pod", // payment on deliver
  ORDER_PALCED_VENDOR: "order.placed.vendor",
  ORDER_PALCED_CUSTOMER: "order.placed.customer",

  ORDER_DELIVERY_REQUESTED: "order.delivery.requested",
  ORDER_PAID_AFTER_DELIVERY: "order.paid.after_delivery",

  ORDER_STATUS_CHANGED: "order.status.change"
} as const

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry]
