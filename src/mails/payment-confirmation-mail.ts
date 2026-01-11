import { Order } from "@/modules/orders/entities/order.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class PaymentConfirmationMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly firstName: string,
    private readonly order: Order
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Payment Confirmation - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.payment-confirmation",
      with: {
        title: "Payment Confirmation - Ski-Shop",
        firstName: this.firstName,
        orderId: this.order.id,
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
