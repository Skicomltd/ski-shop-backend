import Mailgun from "mailgun.js"
import formData from "form-data"
import { Injectable } from "@nestjs/common"
import { MailgunMailOptions } from "../interface/config.interface"
import { IMailMessage, IMailOptionsConfigurator, IMailService } from "../interface/mail.service.interface"
import { ApiException } from "@/exceptions/api.exception"
import { MailQueueProducer } from "../queues/queue-producer.service"

@Injectable()
export class MailgunMailStrategy implements IMailService, IMailOptionsConfigurator {
  private mailgun: ReturnType<Mailgun["client"]>
  private domain: string

  constructor(private readonly mailQueue: MailQueueProducer) {}

  setOptions(options: MailgunMailOptions): IMailService {
    if (!options.apiKey || !options.domain) {
      throw new ApiException("Invalid Mailgun Configuration", 500)
    }

    this.domain = options.domain

    const mg = new Mailgun(formData)
    this.mailgun = mg.client({
      username: "api",
      key: options.apiKey
    })

    return this
  }

  async send(message: IMailMessage): Promise<void> {
    if (!this.mailgun) {
      throw new ApiException("Mailgun not initialized. Did you forget to call setOptions?", 500)
    }

    try {
      await this.mailgun.messages.create(this.domain, {
        from: message.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachment: message.attachments.map((i) => i.content)
      })
    } catch (error) {
      throw new ApiException("Failed to send Mailgun email", 500)
    }
  }

  async queue(message: IMailMessage): Promise<void> {
    await this.mailQueue.dispatch("mailgun", message)
  }
}
