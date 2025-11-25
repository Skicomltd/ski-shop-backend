import { Module } from "@nestjs/common"
import { ContactUsService } from "./contactUs.service"
import { ContactUsController } from "./contactUs.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ContactUs } from "./entities/contactUs.entity"
import { UserModule } from "../users/user.module"

@Module({
  imports: [TypeOrmModule.forFeature([ContactUs]), UserModule],
  controllers: [ContactUsController],
  providers: [ContactUsService]
})
export class ContactUsModule {}
