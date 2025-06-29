import { Job, JobProgress } from "bullmq"
import { Processor, WorkerHost } from "@nestjs/bullmq"

import { IMailMessage } from "@/modules/services/mail/interface/mail.service.interface"
import { MailService } from "@/modules/services/mail/mail.service"
import { MailTransporter } from "@/modules/services/mail/interface/config.interface"
import { AppQueues } from "@/constants"

@Processor(AppQueues.MAIL)
export class MailQueueConsumer extends WorkerHost {
  constructor(private mailService: MailService) {
    super()
  }

  async process({ data, name, progress }: Job<IMailMessage, JobProgress, MailTransporter>): Promise<JobProgress> {
    await this.mailService.getTransporter(name).send(data)

    return progress
  }
}
