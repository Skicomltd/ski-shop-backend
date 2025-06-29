import { JobsOptions, Queue } from "bullmq"
import { InjectQueue } from "@nestjs/bullmq"
import { Injectable } from "@nestjs/common"
import { IMailMessage } from "../interface/mail.service.interface"
import { AppQueues } from "@/constants"
import { MailTransporter } from "../interface/config.interface"

@Injectable()
export class MailQueueProducer {
  constructor(@InjectQueue(AppQueues.MAIL) private queue: Queue) {}

  async dispatch(transporter: MailTransporter, data: IMailMessage, options?: JobsOptions) {
    await this.queue.add(transporter, data, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
      ...options
    })
  }
}
