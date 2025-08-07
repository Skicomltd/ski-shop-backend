import { WithdrawalStatus } from "./withdraw-status.interface"

export interface IWithdrawalResponse {
  id: string
  amount: number
  date: string
  status: WithdrawalStatus
  walletBalance: number
  bank: {
    id: string
    name: string
    firstThreeDigits: string
    lastThreeDigits: string
  }
}
