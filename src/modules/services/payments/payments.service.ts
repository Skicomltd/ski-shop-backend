import { Inject, Injectable } from "@nestjs/common"

import { PaymentModuleOption, PaymentStrategyType } from "./interfaces/config.interface"
import { InitiatePayment, InitiatePaymentResponse, IPaymentService } from "./interfaces/strategy.interface"

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
    const d = this.strategyMap[this.options.default]
    return d.initiatePayment(payload)
  }

  with(provider: PaymentStrategyType) {
    return this.strategyMap[provider]
  }
}
