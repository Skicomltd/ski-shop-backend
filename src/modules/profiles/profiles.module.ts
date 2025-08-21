import { Module } from "@nestjs/common"
import { ProfilesController } from "./profiles.controller"
import { SubscriptionModule } from "../subscription/subscription.module"
import { UserModule } from "../users/user.module"
import { ProductsModule } from "../products/products.module"
import { OrdersModule } from "../orders/orders.module"
import { PayoutsModule } from "../payouts/payouts.module"
import { WithdrawalsModule } from "../withdrawals/withdrawals.module"

@Module({
  imports: [UserModule, SubscriptionModule, ProductsModule, OrdersModule, PayoutsModule, WithdrawalsModule],
  controllers: [ProfilesController]
})
export class ProfilesModule {}
