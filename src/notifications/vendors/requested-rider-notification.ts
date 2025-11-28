import { FcmMessage } from "@/services/push"
import { EventRegistry } from "@/events/events.registry"
import { OrderItem } from "@/modules/orders/entities/order-item.entity"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { BroadcastMessage, DatabaseMessage } from "@/services/notifications/interfaces/messages.interface"
import { NotificationChannel, NotificationData } from "@/services/notifications/interfaces/notification.interface"

type Data = {
  orderId: string
  itemId: string
  deliveryNo: string
}

export class RequestedRiderNotification extends NotificationContract {
  public type = EventRegistry.ORDER_DELIVERY_REQUESTED

  constructor(public orderItem: OrderItem) {
    super(orderItem.product.user)
  }

  via(): NotificationChannel[] {
    return ["database", "broadcast", "push"]
  }

  toDatabase(): DatabaseMessage {
    return this.getData()
  }

  toBroadCast(): BroadcastMessage {
    return {
      topic: this.type,
      data: this.getData()
    }
  }

  toPush(): FcmMessage {
    const data = this.getData()

    return new FcmMessage({
      title: data.title,
      body: data.body,
      tokens: this.orderItem.product.user.fcmTokens,
      data
    })
  }

  private getData(): NotificationData<Data> {
    return {
      title: "Rider on the way!",
      body: "Rider request successful!. Rider on the way!",
      metadata: {
        itemId: this.orderItem.id,
        orderId: this.orderItem.orderId,
        deliveryNo: this.orderItem.deliveryNo
      }
    }
  }
}
