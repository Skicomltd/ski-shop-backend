import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { PaystackWebhookGuard } from "./guard/paystack.guard"
import { Public } from "../auth/decorators/public.decorator"
import { PaystackWebhook } from "../services/payments/interfaces/paystack.interface"

@Public()
@Controller("webhooks")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @UseGuards(PaystackWebhookGuard)
  @Post("paystack")
  async handlePaystackWebhook(@Body() body: PaystackWebhook) {
    console.log("i got here..........................................")

    if (body.event === "charge.success") {
      this.webhookService.handleChargeSuccess(body.data)
    }

    return ""
  }
}
