import { Module } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { OrdersModule } from "../orders/orders.module"
import { WebhookController } from "./webhook.controller"

@Module({
  imports: [OrdersModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhooksModule {}
