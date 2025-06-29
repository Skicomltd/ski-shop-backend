import { Module } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CartsController } from "./carts.controller"
import { CartItemsService } from "./cartItems.service"
import { ProductsModule } from "../products/products.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Cart } from "./entities/cart.entity"
import { CartItems } from "./entities/cartItmes.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItems]), ProductsModule],
  controllers: [CartsController],
  providers: [CartsService, CartItemsService]
})
export class CartsModule {}
