import { Injectable } from "@nestjs/common"
import { InitiatePayment, InitiatePaymentResponse, IPayment, PaystackInitiatePaymentResponse } from "./interfaces/strategy.interface"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom, map } from "rxjs"

@Injectable()
export class PaymentsService implements IPayment {
  constructor(private readonly httpService: HttpService) {}

  async initiatePayment({ currency = "NGN", ...payload }: InitiatePayment): Promise<InitiatePaymentResponse> {
    const secret = "pk_test_6f7e8401bb6d6eff496389fab0b26b4197e55a31"

    const headers = {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json"
    }

    const url = "ttps://api.paystack.co"

    const observable = this.httpService.post<PaystackInitiatePaymentResponse>(url + "/transaction/initialize", { ...payload, currency }, { headers })

    const { data } = await firstValueFrom(observable.pipe(map((res) => res.data)))

    return { reference: data.reference, paymentLink: data.authorization_url }
  }
}
