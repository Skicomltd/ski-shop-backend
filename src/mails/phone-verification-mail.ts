import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class PhoneVerificationMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly firstName: string,
    private readonly phoneNumber: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Phone Verification - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.phone-verification",
      with: {
        title: "Phone Verification - Ski-Shop",
        firstName: this.firstName,
        phoneNumber: this.phoneNumber,
      }
    })
  }

  public attachments(): Attachment[] {
    return []
  }

  public headers(): Header[] {
    return []
  }
}
