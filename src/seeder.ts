import { seeder } from "nestjs-seeder"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./modules/users/entity/user.entity"
import { databaseConfigAsync } from "./config/database.config"
import { ConfigModule } from "@nestjs/config"
import appConfig from "./config/app.config"
import mailConfig from "./config/mail.config"
import filesystemsConfig from "./config/filesystems.config"
import authConfig from "./config/auth.config"
import { Bank } from "./modules/banks/entities/bank.entity"
import { Store } from "./modules/stores/entities/store.entity"
import { Product } from "./modules/products/entities/product.entity"
import { UserSeeder } from "./modules/seeder/user.seeder"
import { BusinessSeeder } from "./modules/seeder/business.seeder"
import { StoreSeeder } from "./modules/seeder/store.seeder"
import { BankSeeder } from "./modules/seeder/bank.seeder"
import { ProductSeeder } from "./modules/seeder/product.seeder"
import { Cart } from "./modules/carts/entities/cart.entity"
import logConfig from "./config/log.config"
import Business from "./modules/business/entities/business.entity"
import { SavedProduct } from "./modules/products/entities/saved-product.entity"
import { Order } from "./modules/orders/entities/order.entity"
import { OrderItem } from "./modules/orders/entities/order-item.entity"
import { Review } from "./modules/reviews/entities/review.entity"
import { Withdrawal } from "./modules/withdrawals/entities/withdrawal.entity"
import { Subscription } from "./modules/subscription/entities/subscription.entity"
import { Plan } from "./modules/plans/entities/plan.entity"
import { Payout } from "./modules/payouts/entities/payout.entity"
import { Promotion } from "./modules/promotions/entities/promotion.entity"
import { Ad } from "./modules/ads/entities/ad.entity"
import { PromotionSeeder } from "./modules/seeder/promotion.seeder"

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, filesystemsConfig, logConfig]
    }),
    TypeOrmModule.forRootAsync(databaseConfigAsync),
    TypeOrmModule.forFeature([
      User,
      Business,
      Bank,
      Store,
      Product,
      Cart,
      SavedProduct,
      Order,
      OrderItem,
      Review,
      Withdrawal,
      Subscription,
      Plan,
      Payout,
      Promotion,
      Ad
    ])
  ],
  providers: [UserSeeder, BusinessSeeder, StoreSeeder, BankSeeder, ProductSeeder, PromotionSeeder]
}).run([UserSeeder, BusinessSeeder, StoreSeeder, BankSeeder, ProductSeeder, PromotionSeeder])
