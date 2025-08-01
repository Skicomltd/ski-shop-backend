import { WithdrawalStatus } from "./withdraw-status.interface"

export interface IWithdrawalResponse {
  id: string
  amount: number
  date: string
  status: WithdrawalStatus
  bank: {
    id: string
    name: string
    firstThreeDigits: string
    lastThreeDigits: string
  }
}
