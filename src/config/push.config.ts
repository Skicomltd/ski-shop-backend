import { ConfigModule, ConfigService, registerAs } from "@nestjs/config"
import { FirebaseModule } from "@services/firebase/firebase.module"
import { PushModuleAsyncOptions, PushModuleOptions } from "@services/push/interfaces/config.interface"

export default registerAs(
  "push",
  (): PushModuleOptions => ({
    fcm: {
      image: "https://techstudio.nyc3.cdn.digitaloceanspaces.com/uploads/tsa-logo.png"
    }
  })
)

export const pushConfigAsync: PushModuleAsyncOptions = {
  imports: [ConfigModule, FirebaseModule],
  useFactory: async (configService: ConfigService) => {
    const config = configService.get<PushModuleOptions>("push")
    return config
  },
  inject: [ConfigService]
}
