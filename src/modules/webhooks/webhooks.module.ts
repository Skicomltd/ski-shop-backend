import { Module } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { OrdersModule } from "../orders/orders.module"

@Module({
  imports: [OrdersModule],
  providers: [WebhookService]
})
export class WebhooksModule {}
