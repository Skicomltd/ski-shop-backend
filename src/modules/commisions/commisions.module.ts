import { Module } from "@nestjs/common"
import { CommisionsService } from "./commisions.service"
import { CommisionsController } from "./commisions.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Commision } from "./entities/commision.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Commision])],
  controllers: [CommisionsController],
  providers: [CommisionsService],
  exports: [CommisionsService]
})
export class CommisionsModule {}
