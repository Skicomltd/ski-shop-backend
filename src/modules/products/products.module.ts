import { Module } from "@nestjs/common"
import { ProductsService } from "./products.service"
import { ProductsController } from "./products.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Product } from "./entities/product.entity"
import { StoreModule } from "../stores/store.module"
import { DtoMapper } from "./interfaces/update-product-mapper.interface"
import { SavedProduct } from "./entities/saved-product.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Product, SavedProduct]), StoreModule],
  controllers: [ProductsController],
  providers: [ProductsService, DtoMapper],
  exports: [ProductsService]
})
export class ProductsModule {}
