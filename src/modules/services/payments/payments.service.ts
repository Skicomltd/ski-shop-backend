import { Inject, Injectable } from "@nestjs/common"

import { PaymentModuleOption, PaymentStrategyType } from "./interfaces/config.interface"
import {
  CreatePlan,
  CreateSubscription,
  InitiatePayment,
  InitiatePaymentResponse,
  IPaymentService,
  PaymentPlanResponse,
  SubscriptionResponse
} from "./interfaces/strategy.interface"

import { CONFIG_OPTIONS } from "./constants/config"
import { PAYMENT_STRATEGY } from "./constants/strategies"
import { PaystackStrategy } from "./strategies/paystack.strategy"

@Injectable()
export class PaymentsService implements IPaymentService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    protected options: PaymentModuleOption,
    @Inject(PAYMENT_STRATEGY.paystack)
    private readonly paystack: PaystackStrategy
  ) {}

  private strategyMap: Record<PaymentStrategyType, IPaymentService> = {
    paystack: this.paystack
  }

  async initiatePayment(payload: InitiatePayment): Promise<InitiatePaymentResponse> {
    return this.with(this.options.default).initiatePayment(payload)
  }

  async validatePayment(reference: string): Promise<boolean> {
    return this.with(this.options.default).validatePayment(reference)
  }

  async createPaymentPlan(data: CreatePlan): Promise<PaymentPlanResponse> {
    return this.with(this.options.default).createPaymentPlan(data)
  }

  async createSubscription(data: CreateSubscription): Promise<SubscriptionResponse> {
    return await this.with(this.options.default).createSubscription(data)
  }

  with(provider: PaymentStrategyType) {
    return this.strategyMap[provider]
  }
}
