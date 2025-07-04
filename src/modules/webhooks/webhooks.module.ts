mport { Module } from '@nestjs/common';
import { WebhookService } from './webhook/webhook.service';

@Module({
  providers: [WebhookService]
})
export class WebhooksModule {}
