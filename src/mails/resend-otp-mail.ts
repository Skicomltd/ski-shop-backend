import { Otp } from "@/modules/auth/entities/otp.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class ResendOtpMail extends Mailable {
  constructor(
    private readonly otp: Otp,
    private readonly firstName: string,
    private readonly verifyUrl: string,
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.otp.email,
      subject: "Your New Verification Code - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.resend-otp",
      with: {
        title: "Resend OTP - Ski-Shop",
        firstName: this.firstName,
        verificationCode: this.otp.code,
        verifyUrl: this.verifyUrl
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
