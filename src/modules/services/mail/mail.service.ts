import * as fs from "fs"
import * as path from "path"
import handlebars from "handlebars"
import { Inject, Injectable } from "@nestjs/common"

import { IMailMessage, IMailOptionsConfigurator, IMailService } from "./interface/mail.service.interface"
import { IMailClients, MailModuleOptions, MailTransporter } from "./interface/config.interface"

import { CONFIG_OPTIONS } from "./entities/config"
import { ApiException } from "@/exceptions/api.exception"
import { MailQueueProducer } from "./queues/queue-producer.service"
import { MAIL_STRATEGY } from "./entities/strategies"
import { SesMailStrategy } from "./strategies/ses.service"
import { MailgunMailStrategy } from "./strategies/mailgun.service"
import { SmtpMailStrategy } from "./strategies/smtp.service"

@Injectable()
export class MailService implements IMailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    protected options: MailModuleOptions,
    private readonly mailQueue: MailQueueProducer,
    @Inject(MAIL_STRATEGY.ses)
    private readonly sesMailService: SesMailStrategy,
    @Inject(MAIL_STRATEGY.mailgun)
    private readonly mailgunMailService: MailgunMailStrategy,
    @Inject(MAIL_STRATEGY.smtp)
    private readonly smtpMailService: SmtpMailStrategy
  ) {
    if (!options.default || !options.clients[options.default]) {
      throw new ApiException(`Invalid default transporter: ${options.default}`, 500)
    }
    this.default = options.default
    this.clients = options.clients
  }

  private default: keyof IMailClients

  private clients: IMailClients

  private strategyMap: Record<MailTransporter, IMailService & IMailOptionsConfigurator> = {
    smtp: this.smtpMailService,
    ses: this.sesMailService,
    mailgun: this.mailgunMailService
  }

  async send(message: IMailMessage) {
    const client = this.clients[this.default]
    const transporter = this.getTransporter(client.transport)

    await transporter.send(message)
  }

  async queue(message: IMailMessage): Promise<void> {
    const options = this.clients[this.default]
    await this.mailQueue.dispatch(options.transport, message, options.queueOptions)
  }

  getTransporter(transporter: MailTransporter): IMailService {
    const strategy = this.strategyMap[transporter]
    if (!strategy) throw new ApiException("Invalid mail strategy", 500)
    return strategy.setOptions(this.clients[transporter])
  }

  static parseHtml(templateName: string, data: Record<string, any>): string {
    try {
      const filePath = path.join(__dirname, `../../../../../views/${templateName}`)

      // Read the template file
      const templateSource = fs.readFileSync(filePath, "utf-8")

      //compile the template
      const template = handlebars.compile(templateSource)

      //return the parsed Html with the data
      return template(data)
    } catch (error) {
      throw new Error(`Failed to parse HTML template: ${error.message}`)
    }
  }
}
