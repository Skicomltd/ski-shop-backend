import { Order } from "@/modules/orders/entities/order.entity"
import { Attachment, Content, Envelope, Header, Mailable } from "@/services/mail"


export class DeliveryCodeMail extends Mailable {
  constructor(
    private readonly email: string,
    private readonly order: Order,
    private readonly firstName: string,
    private readonly exploreUrl: string,
    private readonly deliveryCode: string
  ) {
    super()
  }

  public envelope(): Envelope {
    return new Envelope({
      to: this.email,
      subject: "Product Delivery - Ski-Shop"
    })
  }

  public content(): Content {
    return new Content({
      html: "delivered-product",
      with: {
        title: "Product Delivery - Ski-Shop",
        orderId: this.order.id,
        firstName: this.firstName,
        exploreUrl: this.exploreUrl,
        deliveryCode: this.deliveryCode
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
