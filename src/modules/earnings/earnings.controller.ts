import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common"
import { EarningsService } from "./earnings.service"
import { EarningResponseInterceptor } from "./interceptors/earning-response.interceptor"
import { PolicyEarningGuard } from "./guards/policy-earning.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { Earning } from "./entities/earning.entity"
import { Request } from "express"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { withdrawEarningSchema, WithrawEarningDto } from "./dto/withdraw-earning.dto"
import { BankService } from "../banks/bank.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { PaymentsService } from "../services/payments/payments.service"
import { ApiException } from "@/exceptions/api.exception"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"

@Controller("earnings")
export class EarningsController {
  constructor(
    private readonly earningsService: EarningsService,
    private readonly bankService: BankService,
    private readonly paymentsService: PaymentsService,
    private readonly transactionHelper: TransactionHelper
  ) {}

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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Earning))
  @UseInterceptors(EarningResponseInterceptor)
  async withdraw(@Body(new JoiValidationPipe(withdrawEarningSchema)) dto: WithrawEarningDto, @Req() req: Request) {
    return this.transactionHelper.runInTransaction(async (manager) => {
      const storeId = req.user.business.store.id

      const bank = await this.bankService.findById(dto.bankId)
      if (!bank) throw new NotFoundException("bank not found")
      if (!bank.isMyBank(req.user.id)) throw new BadReqException("invalid bank")

      const earning = await this.earningsService.findOne({ storeId })
      if (!earning) throw new NotFoundException("earning not found")

      if (dto.amount > earning.available) throw new BadReqException("Insufficient fund")

      const balance = await this.paymentsService.checkBalance()
      // ADMIN SHOULD BE NOTIFIED OF THIS!
      if (dto.amount > balance.amount) throw new ApiException("service unavailable", 503)

      const withdrawal = await this.earningsService.withdraw({ amount: dto.amount, bankId: dto.bankId, earning, earningId: earning.id }, manager)

      // if (withdrawal) {
      await this.paymentsService.transfer({
        amount: dto.amount,
        reference: withdrawal.id,
        recipient: bank.recipientCode,
        reason: `${req.user.getFullName()} initiated withdrawal`
      })
      // }

      return earning
    })
  }
}
