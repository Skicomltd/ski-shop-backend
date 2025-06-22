import { Controller, Get, Body, Patch, Param, Delete } from "@nestjs/common"
import { StoreService } from "./store.service"
import { UpdateStoreDto } from "./dto/update-store.dto"
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  findAll() {
    return this.storeService.find()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.storeService.findOne({ id: id })
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateStoreDto: UpdateStoreDto) {
    const store = await this.storeService.findOne({ id: id })
    return this.storeService.update(store, updateStoreDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.storeService.remove({ id: id })
  }
}
