import { Module } from "@nestjs/common"
import { BuyerController } from "./buyer.controller"
import { UserModule } from "../users/user.module"
import { OrdersModule } from "../orders/orders.module"
import { PdfModule } from "../pdf/pdf.module"

@Module({
  imports: [UserModule, OrdersModule, PdfModule],
  controllers: [BuyerController],
  providers: []
})
export class BuyerModule {}
