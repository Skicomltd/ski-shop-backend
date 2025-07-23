import { AxiosError } from "axios"
import { HttpService } from "@nestjs/axios"
import { Inject, Injectable } from "@nestjs/common"
import { catchError, firstValueFrom, map } from "rxjs"

import { CONFIG_OPTIONS } from "../constants/config"
import { PaymentModuleOption } from "../interfaces/config.interface"
import { InitiatePayment, InitiatePaymentResponse, IPaymentService, PaymentPlanResponse } from "../interfaces/strategy.interface"
import {
  CreateSubscription,
  CreatePlan,
  PaystackInitiatePaymentResponse,
  PaystackPlanResponse,
  PaystackTransactionVerification
} from "../interfaces/paystack.interface"

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

    return { reference: data.reference, checkoutUrl: data.authorization_url, checkoutCode: data.access_code }
  }

  async validatePayment(reference: string): Promise<boolean> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }
    const observable = this.httpService.get<PaystackTransactionVerification>(`${this.url}/transaction/verify/${reference}`, { headers })

    const { data } = await firstValueFrom(
      observable.pipe(
        map((res) => res.data),
        catchError((error: AxiosError) => {
          throw error
        })
      )
    )

    if (data.status === "success") return true

    return false
  }

  async createPaymentPlan({ amount, interval, name }: CreatePlan): Promise<PaymentPlanResponse> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.post<PaystackPlanResponse>(`${this.url}/plan`, { name, interval, amount: amount * 100 }, { headers })

    const { data } = await firstValueFrom(
      observable.pipe(
        map((res) => {
          return res.data
        }),
        catchError((error: AxiosError) => {
          throw error
        })
      )
    )

    return { interval: data.interval, amount: data.amount, planCode: data.plan_code, name: data.name }
  }

  async createSubscription({ amount, plan_code, email }: CreateSubscription) {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.post<PaystackInitiatePaymentResponse>(
      `${this.url}//transaction/initialize`,
      { email, plan_code, amount },
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

    return {
      authorization_url: data.authorization_url,
      access_code: data.access_code,
      reference: data.reference
    }
  }
}
