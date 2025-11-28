import { OrderItem } from "@/modules/orders/entities/order-item.entity"
import { User } from "@/modules/users/entity/user.entity"
import { NotificationContract } from "@/services/notifications/contracts/notification.contract"
import { NotificationChannel } from "@/services/notifications/interfaces/notification.interface"

export class RequestedRiderNotification extends NotificationContract {
  type = ""

  constructor(orderItem: OrderItem, user: User) {
    super(user)
  }

  via(): NotificationChannel[] {
    return []
  }
}
