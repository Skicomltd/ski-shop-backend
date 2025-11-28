import { Module } from "@nestjs/common"
import { PayoutsService } from "./payouts.service"
import { PayoutsController } from "./payouts.controller"
import { Payout } from "./entities/payout.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommisionsModule } from "../commisions/commisions.module"

@Module({
  imports: [TypeOrmModule.forFeature([Payout]), CommisionsModule],
  controllers: [PayoutsController],
  providers: [PayoutsService],
  exports: [PayoutsService]
})
export class PayoutsModule {}
