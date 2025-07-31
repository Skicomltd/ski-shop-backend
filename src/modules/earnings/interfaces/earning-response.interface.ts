import { WithdrawalStatus } from "./withdraw-status.interface"

export interface IEarningResponse {
  id: string
  total: number
  available: number
  withdrawn: number
  pending: number
  history: WithdrawalHistory[]
}

type WithdrawalHistory = {
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
