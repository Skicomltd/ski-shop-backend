import { AxiosError } from "axios"
import { HttpService } from "@nestjs/axios"
import { Inject, Injectable } from "@nestjs/common"
import { catchError, firstValueFrom, map } from "rxjs"

import { CONFIG_OPTIONS } from "../constants/config"
import { PaymentModuleOption } from "../interfaces/config.interface"
import { InitiatePayment, InitiatePaymentResponse, IPaymentService, PaystackInitiatePaymentResponse } from "../interfaces/strategy.interface"

@Injectable()
export class PaystackStrategy implements IPaymentService {
  private readonly secret: string
  private readonly url: string = "https://api.paystack.co"

  constructor(
    @Inject(CONFIG_OPTIONS)
    protected readonly options: PaymentModuleOption,
    private readonly httpService: HttpService
  ) {
    this.secret = options.providers.paystack.secret
  }

  async initiatePayment({ currency = "NGN", ...payload }: InitiatePayment): Promise<InitiatePaymentResponse> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.post<PaystackInitiatePaymentResponse>(
      this.url + "/transaction/initialize",
      { ...payload, currency, amount: payload.amount * 100 }, // paystack requires kobo
      { headers }
    )

    const { data } = await firstValueFrom(
      observable.pipe(
        map((res) => res.data),
        catchError((error: AxiosError) => {
          throw error
        })
      )
    )

    return { reference: data.reference, checkoutUrl: data.authorization_url }
  }
}
