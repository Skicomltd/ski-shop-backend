import { OrderStatus } from "@/services/fez"

export class FezWebhookDto {
  orderNumber: string
  status: OrderStatus
}
