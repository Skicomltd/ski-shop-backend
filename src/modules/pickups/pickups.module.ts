import { Module } from "@nestjs/common"
import { PickupsService } from "./pickups.service"
import { PickupsController } from "./pickups.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Pickup } from "./entities/pickup.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Pickup])],
  controllers: [PickupsController],
  providers: [PickupsService]
})
export class PickupsModule {}
