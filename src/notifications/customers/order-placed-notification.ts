import { Address, Content } from "@/services/mail"
import { EventRegistry } from "@/events/events.registry"
import { FcmMessage, PushMessage } from "@/services/push"
import { Order } from "@/modules/orders/entities/order.entity"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { BroadcastMessage, DatabaseMessage, MailMessage } from "@/services/notifications/interfaces/messages.interface"
import { NotificationChannel, NotificationData } from "@/services/notifications/interfaces/notification.interface"

export class CustomerOrderPlacedNotification extends NotificationContract {
  public type = EventRegistry.ORDER_PALCED_CUSTOMER
  public title: string
  public body: string

  constructor(public order: Order) {
    super(order.buyer)
    this.title = `Order confirmed - #${order.id}`
    this.body = `Thanks for shopping with SkiCom! Your order is confirmed and being processed.`
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
    console.error("tokens: ", this.order.buyer.fcmTokens)

    return new FcmMessage({
      title: this.title,
      body: this.body,
      tokens: this.order.buyer.fcmTokens,
      data: this.getData()
    })
  }

  private getData(): NotificationData {
    return {
      title: this.title,
      body: this.body,
      metadata: {
        id: this.order.id
      }
    }
  }
}
