import { Order } from "@/modules/orders/entities/order.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"

export class ConfirmOrderMail extends Mailable {
  constructor(private readonly email: string, private readonly order: Order, private readonly firstName: string) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Confirm Order - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "confirm-order",
      with: {
        title: "Confirm Order - Ski-Shop",
        orderId: this.order.id,
        firstName: this.firstName
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