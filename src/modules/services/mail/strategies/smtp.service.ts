import * as nodemailer from "nodemailer"
import { HttpException, Inject, Injectable } from "@nestjs/common"

import { MailModuleOptions, SmtpMailOptions } from "../interface/config.interface"
import { IMailMessage, IMailOptionsConfigurator, IMailService, MailAddress } from "../interface/mail.service.interface"

import { CONFIG_OPTIONS } from "../entities/config"
import { MailQueueProducer } from "../queues/queue-producer.service"

@Injectable()
export class SmtpMailStrategy implements IMailService, IMailOptionsConfigurator {
  private transporter: nodemailer.Transporter
  private options: SmtpMailOptions
  public from: MailAddress

  constructor(
    private readonly mailQueue: MailQueueProducer,
    @Inject(CONFIG_OPTIONS) protected _options: MailModuleOptions
  ) {
    this.from = _options.from
  }

  setOptions(options: SmtpMailOptions): IMailService {
    if (!options.host || !options.port || !options.auth.pass || !options.auth.user) throw new HttpException("Smtp config not set", 500)

    this.options = options
    this.transporter = nodemailer.createTransport(options)
    return this
  }

  async send(message: IMailMessage) {
    if (!this.transporter) {
      throw new HttpException("SMTP configuration not set", 500)
    }

    await this.transporter.verify()
    return this.transporter.sendMail({ ...message, from: message.from || `${this.from.name} <${this.from.address}>` })
  }

  async queue(message: IMailMessage) {
    await this.mailQueue.dispatch("smtp", message, this.options.queueOptions)
  }
}
