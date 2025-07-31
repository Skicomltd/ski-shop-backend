import { Controller, Get, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common"
import { EarningsService } from "./earnings.service"
import { EarningResponseInterceptor } from "./interceptors/earning-response.interceptor"
import { PolicyEarningGuard } from "./guards/policy-earning.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { Earning } from "./entities/earning.entity"
import { Request } from "express"

@Controller("earnings")
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get("store")
  @UseGuards(PolicyEarningGuard)
  @UseInterceptors(EarningResponseInterceptor)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Earning))
  async store(@Req() req: Request) {
    const storeId = req.user.business.store.id
    const earning = await this.earningsService.findOne({ storeId })
    if (earning) return earning
    return await this.earningsService.create({ storeId })
  }

  @Post("withdraw")
  @UseGuards(PolicyEarningGuard)
  @UseInterceptors(EarningResponseInterceptor)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Earning))
  withdraw() {
    // return this.earningsService.findOne(+id)
  }
}
