import { ModuleMetadata } from "@nestjs/common"

export interface PaystackOptions {
  secret: ""
  subscriptionCode: ""
}

export interface FlutterwaveOptions {}
export interface StripeOptions {}

export interface PaymentModuleOption {
  paystack?: PaystackOptions
  flutterwave?: FlutterwaveOptions
  stripe?: StripeOptions
}

export interface PaymentModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<PaymentModuleOption> | PaymentModuleOption
  inject?: any[]
}
