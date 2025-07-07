import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { WebhookService } from "./webhook.service"
import { PaystackWebhookDto } from "./dto/paystack-webhook-dto"
import { PaystackWebhookGuard } from "./guard/paystack.guard"

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @UseGuards(PaystackWebhookGuard)
  @Post("/paystack")
  async handlePaystackWebhook(@Body() body: PaystackWebhookDto) {
    return await this.webhookService.handlePaystackWebhookEvent(body)
  }
}
