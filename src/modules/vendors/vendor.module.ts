import { Module } from "@nestjs/common"
import { UserModule } from "../users/user.module"
import { StoreModule } from "../stores/store.module"
import { VendorController } from "./vendor.controller"
import { BusinessModule } from "../business/business.module"

@Module({
  imports: [UserModule, StoreModule, BusinessModule],
  controllers: [VendorController]
})
export class VendorModule {}
