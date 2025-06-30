import { MailTransporterOption } from "./config.interface"

export interface MailAddress {
  address: string
  name: string
}

export interface IMailService {
  from: MailAddress
  send(message: IMailMessage): Promise<void>
}

export interface ShouldQueue {
  queue(message: IMailMessage): Promise<void>
}

export interface IMailOptionsConfigurator {
  setOptions(options: MailTransporterOption): IMailService
}

export interface IMailMessage {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
}
