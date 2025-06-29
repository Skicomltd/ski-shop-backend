// import { RegisterQueueOptions } from "@nestjs/bullmq"
import { ModuleMetadata } from "@nestjs/common"
import { JobsOptions } from "bullmq"

export interface MailModuleOptions {
  from: { address: string; name: string }
  clients: IMailClients
  default: keyof IMailClients
  queue: boolean
}

export interface IQueueOptions {
  queueOptions?: JobsOptions
}

export type IMailClients = Record<string, SmtpMailOptions | SesMailOption | MailgunMailOptions>

export type SmtpMailOptions = IQueueOptions & {
  transport: "smtp"
  host: string
  port: number
  url?: string
  encryption?: string
  auth: {
    user: string
    pass: string
  }
}

export type SesMailOption = IQueueOptions & {
  transport: "ses"
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export type MailgunMailOptions = IQueueOptions & {
  transport: "mailgun"
  apiKey: string
  domain: string
}

export type MailTransporter = "smtp" | "ses" | "mailgun"

export type MailTransporterOption = MailgunMailOptions | SesMailOption | SmtpMailOptions

export interface MailModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<MailModuleOptions> | MailModuleOptions
  inject?: any[]
}

// export interface RegisterQueueOptions {}
