import { ModuleMetadata } from "@nestjs/common"

export type PaymentStrategyType = "paystack"

export interface PaystackOptions {
  secret: string
  subscriptionCode: string
}

export interface FlutterwaveOptions {}
export interface StripeOptions {}

export type ProviderConfig = {
  paystack?: PaystackOptions
}

export interface PaymentModuleOption {
  providers: ProviderConfig
  default: keyof ProviderConfig
}

export interface PaymentModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<PaymentModuleOption> | PaymentModuleOption
  inject?: any[]
}
