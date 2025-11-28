import { ConfigModule, ConfigService, registerAs } from "@nestjs/config"
import { FezModuleAsynOptions, FezModuleOptions } from "@/services/fez"

function getOptions(): FezModuleOptions {
  return {
    url: process.env.FEZ_BASE_URL,
    secret: process.env.FEZ_SECRET_KEY,
    userId: process.env.FEZ_USER_ID,
    password: process.env.FEZ_USER_PASSWORD
  }
}

export default registerAs("fez", getOptions)

export const fezConfigAsync: FezModuleAsynOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const config = configService.get<FezModuleOptions>("fez")
    return config
  },
  inject: [ConfigService]
}
