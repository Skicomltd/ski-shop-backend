import { Module } from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { SubscriptionController } from "./subscription.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Subscription } from "./entities/subscription.entity"
import { PlansModule } from "../plans/plans.module"

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), PlansModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
