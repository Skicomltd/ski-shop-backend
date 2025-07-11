import { Module } from "@nestjs/common"
import { ReviewsService } from "./reviews.service"
import { ReviewsController } from "./reviews.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Review } from "./entities/review.entity"
import { UserModule } from "../users/user.module"
import { ProductsModule } from "../products/products.module"

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ProductsModule, UserModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
