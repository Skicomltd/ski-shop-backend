import { AxiosError } from "axios"
import { HttpService } from "@nestjs/axios"
import { Inject, Injectable } from "@nestjs/common"
import { catchError, firstValueFrom, map } from "rxjs"

import { CONFIG_OPTIONS } from "../constants/config"
import { PaymentModuleOption } from "../interfaces/config.interface"
import {
  CreatePlan,
  CreateSubscription,
  CreateTransferRecipient,
  Currency,
  GetSubscription,
  GetSubscriptionResponse,
  InitiatePayment,
  InitiatePaymentResponse,
  IPaymentService,
  PaymentPlanResponse,
  SubscriptionResponse,
  Transfer
} from "../interfaces/strategy.interface"
import {
  CreatePaystackTransferRecipient,
  GetSubscriptionPaystackResponse,
  PaystackBalanceResponse,
  PaystackCreateRcipientResponse,
  PaystackGetBanksResponse,
  PaystackInitiatePaymentResponse,
  PaystackPlanData,
  PaystackPlanResponse,
  PaystackTransactionVerification,
  PaystackTransfer
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

    const observable = this.httpService.post<PaystackPlanResponse<PaystackPlanData>>(
      `${this.url}/plan`,
      { name, interval, amount: amount * 100 },
      { headers }
    )

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

  async createSubscription({ amount, planCode, email }: CreateSubscription): Promise<SubscriptionResponse> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.post<PaystackInitiatePaymentResponse>(
      `${this.url}/transaction/initialize`,
      { email, plan: planCode, amount: amount * 100 },
      { headers }
    )

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

    return {
      authorizationUrl: data.authorization_url,
      accessCode: data.access_code,
      reference: data.reference
    }
  }

  async getSubscription({ code }: GetSubscription): Promise<GetSubscriptionResponse> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.get<PaystackPlanResponse<GetSubscriptionPaystackResponse>>(`${this.url}/subscription/${code}`, { headers })

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

    return {
      plan_code: data.plan.plan_code,
      interval: data.plan.interval,
      customer_code: data.customer.customer_code,
      customer_email: data.customer.email
    }
  }

  async checkBalance() {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.get<PaystackBalanceResponse>(`${this.url}/balance`, { headers })

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

    return data
  }

  async getBanks(currency: Currency = "NGN") {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const observable = this.httpService.get<PaystackGetBanksResponse>(`${this.url}/bank?currency=${currency}`, { headers })

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

    return data.map((d) => ({ name: d.name, code: d.code }))
  }

  async createTransferRecipient(data: CreateTransferRecipient) {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const body: CreatePaystackTransferRecipient = {
      type: "nuban",
      name: data.name,
      account_number: data.accountNumber,
      bank_code: data.bankCode,
      currency: data.currency || "NGN",
      description: data.description,
      metadata: data.metadata
    }

    const observable = this.httpService.post<PaystackCreateRcipientResponse>(`${this.url}/transferrecipient`, body, { headers })

    const { data: result } = await firstValueFrom(
      observable.pipe(
        map((res) => {
          return res.data
        }),
        catchError((error: AxiosError) => {
          throw error
        })
      )
    )

    return {
      code: result.recipient_code,
      name: result.name
    }
  }

  async transfer(data: Transfer): Promise<void> {
    const headers = {
      Authorization: `Bearer ${this.secret}`,
      "Content-Type": "application/json"
    }

    const body: PaystackTransfer = {
      source: "balance",
      amount: data.amount * 100,
      reference: data.reference,
      recipient: data.recipient,
      reason: data.reason,
      currency: data.currency || "NGN"
    }

    const observable = this.httpService.post(`${this.url}/transfer`, body, { headers })

    await firstValueFrom(
      observable.pipe(
        map((res) => {
          return res.data
        }),
        catchError((error: AxiosError) => {
          throw error
        })
      )
    )
  }
}
