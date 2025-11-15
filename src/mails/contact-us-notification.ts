import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"

export class ContactusNotification extends Mailable {
  constructor(
    private readonly to: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.to,
      subject: "New Contact Form Enquiry Received"
    })
  }

  public content(): Content {
    return new Content({
      text: `An enquiry has been received. Please see attend to the enquiry as some as possible`
    })
  }

  public attachments(): Attachment[] {
    return []
  }

  public headers(): Header[] {
    return []
  }
}
