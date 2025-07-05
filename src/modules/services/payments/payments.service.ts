import { Injectable } from "@nestjs/common"
import { InitiatePayment, InitiatePaymentResponse, IPayment } from "./interfaces/strategy.interface"

@Injectable()
export class PaymentsService implements IPayment {
  async initiatePayment({ currency = "NGN", ...payload }: InitiatePayment): Promise<InitiatePaymentResponse> {
    return {
      paymentLink: "",
      reference: ""
    }
  }
}
