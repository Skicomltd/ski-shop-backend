import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common"
import { StoreService } from "./store.service"
import { UpdateStoreDto } from "./dto/update-store.dto"
import { PoliciesGuard } from "../auth/guard/policies-handler.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { Store } from "./entities/store.entity"
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Store))
  findAll() {
    return this.storeService.find()
  }

  @Get(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Store))
  findOne(@Param("id") id: string) {
    return this.storeService.findOne({ id: id })
  }

  @Patch(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Store))
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
