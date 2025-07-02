import { Global, Module } from "@nestjs/common"
import { UtilsModule } from "./utils/utils.module"
import { PaginationModule } from "./pagination/pagination.module"
import { MailModule } from "./mail/mail.module"
import { mailConfigAsync } from "@/config/mail.config"
import { PaginationService } from "./pagination/pagination.service"
import { FileSystemModule } from "./filesystem/filesystem.module"
import { fileConfigAsync } from "@/config/filesystems.config"
import { JwtModule } from "@nestjs/jwt"
import { jwtConfig } from "@/config/jwt.config"
import { CaslModule } from "./casl/casl.module"
import { LogModule } from "./log/log.module"
import { logConfigAsync } from "@/config/log.config"
import { LogService } from "./log/log.service"
import { MailService } from "./mail/mail.service"
import { PaymentsService } from "./payments/payments.service"
import { PaymentsModule } from "./payments/payments.module"

@Global()
@Module({
  imports: [
    PaginationModule,
    UtilsModule,
    MailModule.registerAsync(mailConfigAsync),
    FileSystemModule.registerAsync(fileConfigAsync),
    JwtModule.registerAsync(jwtConfig),
    CaslModule,
    LogModule.registerAsync(logConfigAsync),
    PaymentsModule
  ],
  providers: [PaginationService, LogService, MailService, PaymentsService],
  exports: [MailService, PaginationService, UtilsModule, FileSystemModule, CaslModule, LogService, PaymentsService]
})
export class ServicesModule {}
