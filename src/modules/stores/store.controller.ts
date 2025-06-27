import { Controller, Get, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from "@nestjs/common"
import { StoreService } from "./store.service"
import { UpdateStoreDto } from "./dto/update-store.dto"
import { PoliciesGuard } from "../auth/guard/policies-handler.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { Store } from "./entities/store.entity"
import { StoreInterceptor } from "./interceptors/store.interceptor"
import { StoresInterceptor } from "./interceptors/stores.interceptor"
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @UseInterceptors(StoresInterceptor)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Store))
  findAll() {
    return this.storeService.find()
  }

  @Get(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Store))
  @UseInterceptors(StoreInterceptor)
  findOne(@Param("id") id: string) {
    return this.storeService.findOne({ id: id })
  }

  @Patch(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Store))
  @UseInterceptors(StoreInterceptor)
  async update(@Param("id") id: string, @Body() updateStoreDto: UpdateStoreDto) {
    const store = await this.storeService.findOne({ id: id })
    return this.storeService.update(store, updateStoreDto)
  }

  @Delete(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Store))
  remove(@Param("id") id: string) {
    return this.storeService.remove({ id: id })
  }
}
