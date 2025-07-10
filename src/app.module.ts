import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./modules/auth/auth.module"
import { UserModule } from "./modules/users/user.module"
import { ConfigModule } from "@nestjs/config"
import appConfig from "./config/app.config"
import authConfig from "./config/auth.config"
import mailConfig from "./config/mail.config"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { GlobalExceptionFilters } from "./exceptions/global.exception"
import { TypeOrmModule } from "@nestjs/typeorm"
import { databaseConfigAsync } from "./config/database.config"
import { TransformResponseInterceptor } from "./interceptors/response.interceptor"
import { ServicesModule } from "./modules/services/services.module"
import { UtilsModule } from "./modules/services/utils/utils.module"
import { StoreModule } from "./modules/stores/store.module"
import { BankModule } from "./modules/banks/bank.module"
import filesystemsConfig from "./config/filesystems.config"
import { JwtGuard } from "./modules/auth/guard/jwt-auth.guard"
import { ProductsModule } from "./modules/products/products.module"
import { CartsModule } from "./modules/carts/carts.module"
import logConfig from "./config/log.config"
import { BullModule } from "@nestjs/bullmq"
import { VendorModule } from "./modules/vendors/vendor.module"
import { BusinessModule } from "./modules/business/business.module"
import { WebhooksModule } from "./modules/webhooks/webhooks.module"
import { OrdersModule } from "./modules/orders/orders.module"
import { ReviewsModule } from "./modules/reviews/reviews.module"
import paymentConfig from "./config/payment.config"

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, filesystemsConfig, logConfig, paymentConfig]
    }),
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379
      }
    }),
    TypeOrmModule.forRootAsync(databaseConfigAsync),
    ServicesModule,
    UtilsModule,
    StoreModule,
    BankModule,
    ProductsModule,
    CartsModule,
    VendorModule,
    BusinessModule,
    WebhooksModule,
    OrdersModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilters
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ]
})
export class AppModule {}
