import { Module } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { OrdersModule } from "../orders/orders.module"
import { WebhookController } from "./webhook.controller"
import { PaymentsService } from "../services/payments/payments.service"

@Module({
  imports: [OrdersModule],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentsService]
})
export class WebhooksModule {}
