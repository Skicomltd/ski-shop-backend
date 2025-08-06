import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

export interface IRevenueQuery extends PaginationParams {
  startDate?: Date
  endDate?: Date
  storeId?: string
}
