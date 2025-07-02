import { Module } from "@nestjs/common"
import { UserModule } from "../users/user.module"
import { StoreModule } from "../stores/store.module"
import { VendorController } from "./vendor.controller"

@Module({
  imports: [UserModule, StoreModule],
  controllers: [VendorController]
})
export class VendorModule {}
