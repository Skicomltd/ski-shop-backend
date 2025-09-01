import { Module } from "@nestjs/common"
import { DateService } from "./date/date.service"
import { HelpersService } from "./helpers/helpers.service"
import { TransactionHelper } from "./transactions/transactions.service"
import { JwtModule } from "@nestjs/jwt"
import { jwtConfig } from "@/config/jwt.config"
import { CsvService } from "./csv/csv.service"

@Module({
  imports: [JwtModule.registerAsync(jwtConfig)],
  providers: [DateService, HelpersService, TransactionHelper, CsvService],
  exports: [DateService, HelpersService, TransactionHelper, CsvService]
})
export class UtilsModule {}
