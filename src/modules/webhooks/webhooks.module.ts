import { Module } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { OrdersModule } from "../orders/orders.module"
import { WebhookController } from "./webhook.controller"
import { PaymentsService } from "../services/payments/payments.service"
import { PlansModule } from "../plans/plans.module"
import { UserModule } from "../users/user.module"
import { SubscriptionModule } from "../subscription/subscription.module"

@Module({
  imports: [OrdersModule, SubscriptionModule, PlansModule, UserModule],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentsService]
})
export class WebhooksModule {}
