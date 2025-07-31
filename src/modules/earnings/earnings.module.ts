import { Module } from "@nestjs/common"
import { EarningsService } from "./earnings.service"
import { EarningsController } from "./earnings.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Earning } from "./entities/earning.entity"
import { Withdrawal } from "./entities/withdrawal.entity"
import { BankModule } from "../banks/bank.module"

@Module({
  imports: [TypeOrmModule.forFeature([Earning, Withdrawal]), BankModule],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService]
})
export class EarningsModule {}
