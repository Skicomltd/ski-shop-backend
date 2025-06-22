import { seeder } from "nestjs-seeder"
import { UserModule } from "./modules/users/user.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./modules/users/entity/user.entity"
import { databaseConfigAsync } from "./config/database.config"
import { ConfigModule } from "@nestjs/config"
import appConfig from "./config/app.config"
import mailConfig from "./config/mail.config"
import filesystemsConfig from "./config/filesystems.config"
import authConfig from "./config/auth.config"
import Business from "./modules/users/entity/business.entity"
import { Bank } from "./modules/banks/entities/bank.entity"
import { Store } from "./modules/stores/entities/store.entity"
import { Product } from "./modules/products/entities/product.entity"
import { UserSeeder } from "./modules/seeder/user.seeder"
import { BusinessSeeder } from "./modules/seeder/business.seeder"
import { StoreSeeder } from "./modules/seeder/store.seeder"
import { BankSeeder } from "./modules/seeder/bank.seeder"
import { ProductSeeder } from "./modules/seeder/product.seeder"

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, filesystemsConfig]
    }),
    TypeOrmModule.forRootAsync(databaseConfigAsync),
    TypeOrmModule.forFeature([User, Business, Bank, Store, Product]),
    UserModule
  ],
  providers: [UserSeeder, BusinessSeeder, StoreSeeder, BankSeeder, ProductSeeder]
}).run([UserSeeder, BusinessSeeder, StoreSeeder, BankSeeder, ProductSeeder])
