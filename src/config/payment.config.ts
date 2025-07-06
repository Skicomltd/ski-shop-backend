import { PaymentModuleAsyncOptions, PaymentModuleOption } from "@/modules/services/payments/interfaces/config.interface"
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config"

function getOptions(): PaymentModuleOption {
  return {
    paystack: {
      secret: "",
      subscriptionCode: ""
    }
  }
}

export const mailConfigAsync: PaymentModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const config = configService.get<PaymentModuleOption>("payment")
    return config
  },
  inject: [ConfigService]
}

export default registerAs("payment", getOptions)
