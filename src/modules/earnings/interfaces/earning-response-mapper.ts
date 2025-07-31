import { Earning } from "../entities/earning.entity"
import { IEarningResponse } from "./earning-response.interface"

export abstract class EarningResponseMapper implements IInterceptor {
  public transform(data: Earning): IEarningResponse {
    return {
      id: data.id,
      pending: data.pending,
      available: data.available,
      withdrawn: data.withdrawn,
      total: data.total,
      history: data.withdrawals.map((w) => ({
        amount: w.amount,
        date: w.createdAt.toISOString(),
        status: w.status,
        bank: {
          id: w.bank.id,
          name: w.bank.bankName,
          firstThreeDigits: w.bank.accountNumber.substring(0, 3),
          lastThreeDigits: w.bank.accountNumber.substring(w.bank.accountNumber.length - 3, w.bank.accountNumber.length)
        }
      }))
    }
  }
}
