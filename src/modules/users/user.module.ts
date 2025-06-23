import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import Business from "./entity/business.entity"
import { ConfigModule } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { User } from "./entity/user.entity"
import { BusinessService } from "./business.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, Business]), ConfigModule],
  controllers: [UserController],
  providers: [UserService, JwtService, BusinessService],
  exports: [UserService, BusinessService]
})
export class UserModule {}
