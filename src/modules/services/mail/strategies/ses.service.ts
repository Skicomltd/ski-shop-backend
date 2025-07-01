import { SendEmailCommand, SESClient, SendEmailCommandInput } from "@aws-sdk/client-ses"
import { HttpException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common"

import { CONFIG_OPTIONS } from "../entities/config"
import { MailModuleOptions, SesMailOption } from "../interface/config.interface"
import { IMailMessage, IMailOptionsConfigurator, IMailService, MailAddress } from "../interface/mail.service.interface"

import { MailQueueProducer } from "../queues/queue-producer.service"

@Injectable()
export class SesMailStrategy implements IMailService, IMailOptionsConfigurator {
  private ses: SESClient
  public from: MailAddress

  constructor(
    private readonly mailQueue: MailQueueProducer,
    @Inject(CONFIG_OPTIONS) protected options: MailModuleOptions
  ) {
    this.from = options.from
  }

  async send(message: IMailMessage) {
    if (!this.ses) {
      throw new HttpException("SES configuration not set", 500)
    }

    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: Array.isArray(message.to) ? message.to : [message.to]
      },

      Message: {
        Subject: {
          Data: message.subject,
          Charset: "UTF-8"
        },
        Body: {
          Text: message.text ? { Data: message.text, Charset: "UTF_8" } : undefined,
          Html: message.html ? { Data: message.html, Charset: "UTF-8" } : undefined
        }
      },
      Source: message.from || `${this.from?.name} <${this.from?.address}>`
    }

    if (message.attachments?.length) {
      throw new InternalServerErrorException("SES transporter does not support attachments directly. Consider using SMTP for attachments")
    }

    try {
      const command = new SendEmailCommand(params)
      await this.ses.send(command)
    } catch (error) {
      throw new InternalServerErrorException(`Failed to send Email: ${error}`)
    }
  }

  async queue(message: IMailMessage) {
    await this.mailQueue.dispatch("ses", message)
  }

  setOptions(options: SesMailOption): IMailService {
    if (!options.accessKeyId || !options.secretAccessKey || !options.region) {
      throw new HttpException("Invalid SES configuration", 500)
    }

    this.ses = new SESClient({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey
      }
    })

    return this
  }
}
