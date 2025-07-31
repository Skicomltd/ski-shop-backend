import { Request } from "express"
import { Controller, Get, Req, UseGuards, UseInterceptors } from "@nestjs/common"

import { Payout } from "./entities/payout.entity"
import { PayoutsService } from "./payouts.service"
import { Action } from "../services/casl/actions/action"
import { PolicyPayoutGuard } from "./guards/policy-payout.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { PayoutResponseInterceptor } from "./interceptors/payout-response.interceptor"

@Controller("payouts")
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get("store")
  @UseGuards(PolicyPayoutGuard)
  @UseInterceptors(PayoutResponseInterceptor)
  @CheckPolicies((ability) => ability.can(Action.Read, Payout))
  async store(@Req() req: Request) {
    const storeId = req.user.business.store.id
    const earning = await this.payoutsService.findOne({ storeId })
    if (earning) return earning
    return await this.payoutsService.create({ storeId })
  }
}
