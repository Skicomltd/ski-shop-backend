import { Otp } from "@/modules/auth/entities/otp.entity"
import { User } from "@/modules/users/entity/user.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"

export class WelcomeMail extends Mailable {
  constructor(
    private readonly user: User,
    private readonly otp: Otp,
    private readonly exploreUrl: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.user.email,
      subject: "Welcome to Ski-Shop - Verify Your Email"
    })
  }

  public content(): Content {
    return new Content({
      html: "welcome-email",
      with: {
        title: "Welcome to Ski-Shop",
        firstName: this.user.firstName,
        exploreUrl: this.exploreUrl,
        verificationCode: this.otp.code
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
