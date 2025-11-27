export const ORDER_DELIVERY_STATUS = [
  "uninitiated", // Vendor yet to request delivery
  "pending", // Order placed but not yet picked up
  "assigned", // Assigned to a rider / courier
  "picked_up", // Package collected
  "in_transit", // Moving between hubs or on the way
  "arrived_at_hub", // Reached local hub / sorting center
  "out_for_delivery", // Rider dispatched to deliver
  "delivered", // Successfully delivered
  "failed_delivery", // Delivery attempt failed
  "returned", // Returned to sender
  "cancelled" // Cancelled by user or system
] as const

export type OrderDeliveryStatus = (typeof ORDER_DELIVERY_STATUS)[number]
