import { Module } from "@nestjs/common"
import { FezService } from "./fez.service"

@Module({
  providers: [FezService],
  exports: [FezService]
})
export class FezModule {}
