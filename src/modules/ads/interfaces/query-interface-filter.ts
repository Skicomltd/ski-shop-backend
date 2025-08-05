import { FindOperator, FindOptionsWhere } from "typeorm"
import { Ad } from "../entities/ad.entity"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { AD_STATUS } from "../enums/ad-status.enum"

// Get the union type of AD_STATUS values
type AdStatus = (typeof AD_STATUS)[number] // "active" | "inactive" | "expired"

export interface IAdsQuery extends PaginationParams, Omit<FindOptionsWhere<Ad>, "status"> {
  storeId?: string
  vendorId?: string
  startDate?: Date
  endDate?: Date
  status?: AdStatus | AdStatus[] | FindOperator<AdStatus>
}
