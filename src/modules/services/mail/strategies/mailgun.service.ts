import Mailgun from "mailgun.js"
import formData = require("form-data")
import { HttpException, Inject, Injectable } from "@nestjs/common"

import { CONFIG_OPTIONS } from "../entities/config"
import { MailgunMailOptions, MailModuleOptions } from "../interface/config.interface"
import { IMailMessage, IMailOptionsConfigurator, IMailService, MailAddress } from "../interface/mail.service.interface"

import { MailQueueProducer } from "../queues/queue-producer.service"

@Injectable()
export class MailgunMailStrategy implements IMailService, IMailOptionsConfigurator {
  private mailgun: ReturnType<Mailgun["client"]>
  private domain: string
  public from: MailAddress

  constructor(
    private readonly mailQueue: MailQueueProducer,
    @Inject(CONFIG_OPTIONS)
    protected options: MailModuleOptions
  ) {
    this.from = options.from
  }

  setOptions(options: MailgunMailOptions): IMailService {
    if (!options.apiKey || !options.domain) {
      throw new HttpException("Invalid Mailgun Configuration", 500)
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
      throw new HttpException("Mailgun not initialized. Did you forget to call setOptions?", 500)
    }

    try {
      await this.mailgun.messages.create(this.domain, {
        from: message.from || `${this.from.name} <${this.from.address}>`,
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
