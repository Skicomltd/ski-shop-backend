import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"

export class PasswordRestMail extends Mailable {
  constructor(
    private readonly link: string,
    private readonly to: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.to,
      subject: "Password Reset Link"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.password-reset",
      with: {
        title: "Reset Your Password - Ski-Shop",
        resetUrl: this.link
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
