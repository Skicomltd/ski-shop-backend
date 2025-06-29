import { ProductStatusEnum } from "@/modules/common/types"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { vendonEnumType } from "@/modules/stores/entities/store.entity"

export interface IProductsQuery extends PaginationParams {
  status?: ProductStatusEnum
  stockCount?: number
  storeId: string
  categories: string
  vendorType: vendonEnumType
}
