import Mailgun from "mailgun.js"
import formData = require("form-data")
import { Inject, Injectable } from "@nestjs/common"
import { MailgunMailOptions, MailModuleOptions } from "../interface/config.interface"
import { IMailMessage, IMailOptionsConfigurator, IMailService } from "../interface/mail.service.interface"
import { ApiException } from "@/exceptions/api.exception"
import { MailQueueProducer } from "../queues/queue-producer.service"
import { CONFIG_OPTIONS } from "../entities/config"

@Injectable()
export class MailgunMailStrategy implements IMailService, IMailOptionsConfigurator {
  private mailgun: ReturnType<Mailgun["client"]>
  private domain: string
  private from: { address: string; name: string }

  constructor(
    private readonly mailQueue: MailQueueProducer,
    @Inject(CONFIG_OPTIONS)
    protected options: MailModuleOptions
  ) {
    this.from = options.from
  }

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
        from: message.from || this.from.address,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachment: message.attachments?.map((i) => i.content)
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  async queue(message: IMailMessage): Promise<void> {
    await this.mailQueue.dispatch("mailgun", message)
  }
}
