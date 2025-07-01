import { Module } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CartsController } from "./carts.controller"
import { ProductsModule } from "../products/products.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Cart } from "./entities/cart.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductsModule],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule {}
