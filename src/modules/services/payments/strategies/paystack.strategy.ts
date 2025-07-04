import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"

import { InitiatePayment, IPayment, PaystackInitiatePaymentResponse } from "../interfaces/strategy.interface"

@Injectable()
export class PaystackStrategy implements IPayment {
  private readonly secret: string
  private readonly url: string = "https://api.paystack.co"

  constructor(private readonly httpService: HttpService) {}

  async initiatePayment(payload: InitiatePayment) {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.post<PaystackInitiatePaymentResponse>(this.url + "/transaction/initialize", payload, { headers })

    const { data } = await firstValueFrom(observable.pipe())

    return { reference: data.data.reference, paymentLink: data.data.authorization_url }
  }
}
