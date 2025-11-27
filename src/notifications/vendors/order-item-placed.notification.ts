import { FcmMessage } from "@/services/push"
import { Address, Content } from "@/services/mail"
import { EventRegistry } from "@/events/events.registry"
import { OrderItem } from "@/modules/orders/entities/order-item.entity"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { NotificationChannel, NotificationData } from "@/services/notifications/interfaces/notification.interface"
import { BroadcastMessage, DatabaseMessage, MailMessage, PushMessage } from "@/services/notifications/interfaces/messages.interface"

export class VendorOrderItemPlacedNotification extends NotificationContract {
  type = EventRegistry.ORDER_PALCED_VENDOR
  title: string
  body: string

  constructor(
    public order: OrderItem,
    public orderId: string
  ) {
    super(order.product.user)
    this.title = `Order Confirmed - #${orderId}`
    this.body = `New order placed for ${order.product.name}`
  }

  via(): NotificationChannel[] {
    return ["mail", "push", "broadcast", "database"]
  }

  toBroadCast(): BroadcastMessage {
    return {
      topic: this.type,
      data: this.getData()
    }
  }

  toDatabase(): DatabaseMessage {
    return this.getData()
  }

  toMail(): MailMessage {
    return new MailMessage({
      to: new Address(this.notifiable.email, this.notifiable.firstName),
      subject: this.title,
      message: new Content({ text: this.body })
    })
  }

  toPush(): PushMessage {
    return new FcmMessage({
      title: this.title,
      body: this.body,
      tokens: this.order.product.user.fcmTokens,
      data: this.getData()
    })
  }

  private getData(): NotificationData {
    return {
      title: this.title,
      body: this.body,
      metadata: {
        orderId: this.orderId,
        itemId: this.order.id
      }
    }
  }
}
