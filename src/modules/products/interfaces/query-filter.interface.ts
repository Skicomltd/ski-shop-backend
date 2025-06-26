import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { ProductStatusEnum } from "../entities/product.entity"
import { FindOperator } from "typeorm"

export interface IProductsQuery extends PaginationParams {
  status?: ProductStatusEnum
  stockCount?: number
  storeId?: string
  slug?: string | FindOperator<string>
}
