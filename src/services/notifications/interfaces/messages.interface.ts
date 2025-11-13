import { NotificationData } from "./notification.interface"
import { PushMessage as PMessage } from "@/services/push/interfaces/message.interface"
import { Header } from "@/services/mail/interface/messages.interface"
import { Attachment } from "@/services/mail/mailables/attachment"
import { Content } from "@/services/mail/mailables/content"
import { Envelope } from "@/services/mail/mailables/envelope"
import { Address } from "@services/mail/mailables/address"
import { Mailable } from "@services/mail/mailables/mailable"

export type BroadcastMessage = {
  topic?: string
  data: NotificationData
}

export type SmsMessage = {
  title: string
  body: string
}

export type DatabaseMessage = NotificationData

export type PushMessage = PMessage

type MailMessageType = {
  to: Address | string
  from?: Address | string
  subject: string
  message: string | Content
  client?: string
}
export class MailMessage extends Mailable {
  private readonly to: Address | string
  private readonly from: Address | string
  private readonly message: string | Content
  private readonly subject: string
  public client: string

  constructor(data: MailMessageType) {
    super()
    this.to = data.to
    this.subject = data.subject
    this.message = data.message
    this.from = data.from
    this.client = data.client
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.to,
      from: this.from,
      subject: this.subject
    })
  }

  public content(): Content {
    if (typeof this.message === "string") {
      return new Content({
        text: this.message
      })
    }

    return this.message
  }

  public attachments(): Attachment[] {
    return []
  }
  public headers(): Header[] {
    return []
  }

  public withClient(client: string) {
    this.client = client
    return this
  }
}
