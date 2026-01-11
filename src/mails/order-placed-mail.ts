import { Order } from "@/modules/orders/entities/order.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class OrderPlacedMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly order: Order,
    private readonly firstName: string,
    private readonly orderUrl: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Order Placed Confirmation - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "mail.order-placed",
      with: {
        title: "Order Placed - Ski-Shop",
        orderId: this.order.id,
        firstName: this.firstName,
        orderUrl: this.orderUrl
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
