import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common"
import { WithdrawalsService } from "./withdrawals.service"
import { PolicyWithdrawalGuard } from "./guards/policy-withdrawal.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Action } from "../services/casl/actions/action"
import { Withdrawal } from "./entities/withdrawal.entity"
import { WithdrawalResponseInterceptor } from "./interceptors/withdrawal.interceptor"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { CreateWithdrawalDto, createWithdrawalSchema } from "./dto/create-withdrawal.dto"
import { Request } from "express"
import { BankService } from "../banks/bank.service"
import { PaymentsService } from "../services/payments/payments.service"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { PayoutsService } from "../payouts/payouts.service"
import { ApiException } from "@/exceptions/api.exception"
import { WithdrawalsResponseInterceptor } from "./interceptors/withdrawals.interceptor"

@Controller("withdrawals")
export class WithdrawalsController {
  constructor(
    private readonly withdrawalsService: WithdrawalsService,
    private readonly bankService: BankService,
    private readonly paymentsService: PaymentsService,
    private readonly transactionHelper: TransactionHelper,
    private readonly payoutsService: PayoutsService
  ) {}

  @Post("")
  @UseGuards(PolicyWithdrawalGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Withdrawal))
  @UseInterceptors(WithdrawalResponseInterceptor)
  async withdraw(@Body(new JoiValidationPipe(createWithdrawalSchema)) dto: CreateWithdrawalDto, @Req() req: Request) {
    return await this.transactionHelper.runInTransaction(async (manager) => {
      const storeId = req.user.business.store.id

      const bank = await this.bankService.findById(dto.bankId)
      if (!bank) throw new NotFoundException("bank not found")
      if (!bank.isMyBank(req.user.id)) throw new BadReqException("invalid bank")

      const payout = await this.payoutsService.findOne({ storeId })
      if (!payout) throw new NotFoundException("payout not found")

      if (dto.amount > payout.available) throw new BadReqException("Insufficient fund")

      const balance = await this.paymentsService.checkBalance()
      // ADMIN SHOULD BE NOTIFIED OF THIS!
      if (dto.amount > balance.amount) throw new ApiException("service unavailable", 503)

      const updatePayoutDto = payout.handleWithdaw(dto.amount)

      const updatedPayout = await this.payoutsService.update(payout, updatePayoutDto, manager)

      const withdrawal = await this.withdrawalsService.create({ amount: dto.amount, payout: updatedPayout, bank, bankId: bank.id }, manager)

      await this.paymentsService.transfer({
        amount: dto.amount,
        reference: withdrawal.id,
        recipient: bank.recipientCode,
        reason: `${req.user.getFullName()} initiated withdrawal`
      })

      return withdrawal
    })
  }

  @Get("")
  @CheckPolicies((ability) => ability.can(Action.Read, Withdrawal))
  @UseInterceptors(WithdrawalsResponseInterceptor)
  async find(@Req() req: Request) {
    const storeId = req.user.business.store.id
    const payout = await this.payoutsService.findOne({ storeId })
    return await this.withdrawalsService.find({ payout: { id: payout.id } })
  }

  @Get(":id")
  @CheckPolicies((ability) => ability.can(Action.Read, Withdrawal))
  @UseInterceptors(WithdrawalResponseInterceptor)
  async findById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.withdrawalsService.findById(id)
  }
}
