import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class PasswordChangeMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly firstName: string,
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Password Change Confirmation - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "password-change",
      with: {
        title: "Password Changed - Ski-Shop",
        firstName: this.firstName,
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
