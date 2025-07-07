export class PaystackWebhookDto {
  event: PaystackEventEnum
  data: {
    reference: string
  }
}
