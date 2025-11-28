import { User } from "@/modules/users/entity/user.entity"
import { OrderItem } from "@/modules/orders/entities/order-item.entity"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { NotificationChannel } from "@/services/notifications/interfaces/notification.interface"
import { BroadcastMessage, DatabaseMessage, PushMessage } from "@/services/notifications/interfaces/messages.interface"
import { OrderDeliveryStatus } from "@/modules/orders/interfaces/delivery-status"

type Data = {
  title: string
  body: string
}

export class OrderStatusChangeNotification extends NotificationContract {
  public type = ""
  public title = ""
  public body = ""

  constructor(
    public orderItem: OrderItem,
    public user: User
  ) {
    super(user)
  }

  via(): NotificationChannel[] {
    return ["database", "broadcast", "push"]
  }

  toDatabase(): DatabaseMessage {}

  toBroadCast(): BroadcastMessage {}

  toPush(): PushMessage {}

  private getData(status: OrderDeliveryStatus): Data {
    switch (status) {
      case "pending":
        return { title: "We're preparing your order", body: "Your items are being carefully prepared for shipment. We'll notify you once shipped." }

      case "assigned":
        return { title: "Rider Assigned!", body: "A Rider Has Been Assigned to Your Order" }

      case "picked_up":
        return {
          title: "Your order has shipped",
          body: `Order item #${this.orderItem.orderId} is on its way! Estimated delivery: ${this.orderItem.expectedAt.toLocaleDateString("default", { day: "2-digit", month: "short", year: "2-digit" })}.`
        } // send email when order is picked up

      case "in_transit":
        return { title: "", body: "" }

      case "arrived_at_hub":
        return { title: "", body: "" }

      case "out_for_delivery":
        return { title: "", body: "" }

      case "delivered":
        return { title: "", body: "" }

      case "failed_delivery":
        return { title: "", body: "" }

      case "returned":
        return { title: "", body: "" }

      case "cancelled":
        return { title: "", body: "" }
    }

    return { title: "", body: "" }
  }
}
