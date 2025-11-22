import { ConfigModule, ConfigService } from "@nestjs/config"

import { mailConfigAsync } from "./mail.config"
import { pushConfigAsync } from "./push.config"

import { MailModule } from "@/services/mail/mail.module"
import { NotificationModuleAsyncOptions } from "@services/notifications/interfaces/config.interface"
import { MailModuleOptions } from "@services/mail/interface/config.interface"
import { PushModuleOptions } from "@services/push/interfaces/config.interface"
import { PushModule } from "@services/push/push.module"

export const notificationConfigAsync: NotificationModuleAsyncOptions = {
  imports: [ConfigModule, MailModule.registerAsync(mailConfigAsync), PushModule.registerAsync(pushConfigAsync)],
  useFactory: async (configService: ConfigService) => {
    const mailConfig = configService.get<MailModuleOptions>("mail")
    const pushConfig = configService.get<PushModuleOptions>("push")
    return { mail: mailConfig, push: pushConfig }
  },
  inject: [ConfigService]
}
