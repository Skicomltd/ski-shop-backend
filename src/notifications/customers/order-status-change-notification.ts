import { FcmMessage } from "@/services/push"
import { EventRegistry } from "@/events/events.registry"
import { User } from "@/modules/users/entity/user.entity"
import { OrderItem } from "@/modules/orders/entities/order-item.entity"
import { OrderDeliveryStatus } from "@/modules/orders/interfaces/delivery-status"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { NotificationChannel, NotificationData } from "@/services/notifications/interfaces/notification.interface"
import { BroadcastMessage, DatabaseMessage, PushMessage } from "@/services/notifications/interfaces/messages.interface"

type Data = {
  orderId: string
  itemId: string
}

export class OrderStatusChangeNotification extends NotificationContract {
  public type = EventRegistry.ORDER_STATUS_CHANGED

  constructor(
    public orderItem: OrderItem,
    public user: User
  ) {
    super(user)
  }

  via(): NotificationChannel[] {
    return ["database", "broadcast", "push"]
  }

  toDatabase(): DatabaseMessage {
    return this.getData(this.orderItem.deliveryStatus)
  }

  toBroadCast(): BroadcastMessage {
    return {
      topic: this.type,
      data: this.getData(this.orderItem.deliveryStatus)
    }
  }

  toPush(): PushMessage {
    const data = this.getData(this.orderItem.deliveryStatus)

    return new FcmMessage({
      title: data.title,
      body: data.body,
      tokens: this.user.fcmTokens,
      data
    })
  }

  private getData(status: OrderDeliveryStatus): NotificationData<Data> {
    switch (status) {
      case "pending":
        return {
          title: "We're preparing your order",
          body: "Your items are being carefully prepared for shipment. We'll notify you once shipped.",
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "assigned":
        return {
          title: "Rider Assigned!",
          body: "A Rider Has Been Assigned to Your Order",
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "picked_up":
        return {
          title: "Your order has shipped",
          body: `Order item #${this.orderItem.deliveryNo} is on its way! Estimated delivery: ${this.orderItem.expectedAt.toLocaleDateString("default", { day: "2-digit", month: "short", year: "2-digit" })}.`,
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        } // send email when order is picked up

      // case "in_transit":
      //   return { title: "", body: "" } // No need for notification

      // case "arrived_at_hub":
      //   return { title: "", body: "" } // I am not sure yet

      case "out_for_delivery":
        return {
          title: "Arriving today!",
          body: "Your SkiCom order is out for delivery. Expected by today.",
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "delivered":
        return {
          title: "Delivered successfully",
          body: `Your order ${this.orderItem.deliveryNo} has been delivered. Hope you love your purchase!`,
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "failed_delivery":
        return {
          title: "We missed you",
          body: `Delivery attempted for order ${this.orderItem.deliveryNo}. We'll try again [DATE] or you can reschedule.`,
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "returned":
        return {
          title: "",
          body: "",
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }

      case "cancelled":
        return {
          title: "Order cancelled",
          body: `Order ${this.orderItem.deliveryNo} has been cancelled. Refund will process within 3-5 business days.`,
          metadata: {
            orderId: this.orderItem.orderId,
            itemId: this.orderItem.id
          }
        }
    }

    return {
      title: "",
      body: "",
      metadata: {
        orderId: this.orderItem.orderId,
        itemId: this.orderItem.id
      }
    }
  }
}
