import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

export interface IRevenueQuery extends PaginationParams {
  month: number
  year: number
}
