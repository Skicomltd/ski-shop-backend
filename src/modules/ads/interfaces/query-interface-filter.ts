import { FindOptionsWhere } from "typeorm"

import { Ad } from "../entities/ad.entity"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

export interface IAdsQuery extends PaginationParams, FindOptionsWhere<Ad> {
  storeId?: string
  vendorId?: string
}
