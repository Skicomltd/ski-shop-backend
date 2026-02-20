import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"

export class StoreInviteMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly inviterName: string,
    private readonly inviteUrl: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "You have been invited to join a store on Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.store-invite",
      with: {
        title: "Store Invite - Ski-Shop",
        inviterName: this.inviterName,
        inviteUrl: this.inviteUrl
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
