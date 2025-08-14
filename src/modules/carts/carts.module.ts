import { Module } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CartsController } from "./carts.controller"
import { ProductsModule } from "../products/products.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Cart } from "./entities/cart.entity"
import { OrdersModule } from "../orders/orders.module"
import { UserModule } from "../users/user.module"
import { VoucherModule } from "../vouchers/voucher.module"

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductsModule, OrdersModule, UserModule, VoucherModule],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule {}
