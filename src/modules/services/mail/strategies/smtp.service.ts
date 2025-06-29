import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"
import { IMailMessage, IMailOptionsConfigurator, IMailService } from "../interface/mail.service.interface"
import { SmtpMailOptions } from "../interface/config.interface"
import { MailQueueProducer } from "../queues/queue-producer.service"

@Injectable()
export class SmtpMailStrategy implements IMailService, IMailOptionsConfigurator {
  constructor(private readonly mailQueue: MailQueueProducer) {}

  private transporter: nodemailer.Transporter
  private options: SmtpMailOptions

  setOptions(options: SmtpMailOptions): IMailService {
    if (!options.host || !options.port || !options.auth.pass || !options.auth.user) throw new Error("Smtp config not set")
    this.options = options
    this.transporter = nodemailer.createTransport(options)
    return this
  }

  async send(message: IMailMessage) {
    if (!this.transporter) {
      throw new Error("SMTP configuration not set")
    }

    await this.transporter.verify()
    return this.transporter.sendMail({ ...message })
  }

  async queue(message: IMailMessage) {
    await this.mailQueue.dispatch("smtp", message, this.options.queueOptions)
  }
}
