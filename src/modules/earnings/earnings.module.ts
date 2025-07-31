import { Module } from "@nestjs/common"
import { EarningsService } from "./earnings.service"
import { EarningsController } from "./earnings.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Earning } from "./entities/earning.entity"
import { Withdrawal } from "./entities/withdrawal.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Earning, Withdrawal])],
  controllers: [EarningsController],
  providers: [EarningsService]
})
export class EarningsModule {}
