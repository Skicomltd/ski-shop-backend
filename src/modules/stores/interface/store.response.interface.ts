import Business from "@/modules/users/entity/business.entity"
import { vendonEnumType } from "../entities/store.entity"
import { ProductCategoriesEnum } from "@/modules/common/types"

export interface StoreResponse {
  id: string
  name: string
  description: string
  category: ProductCategoriesEnum
  business: Business
  type: vendonEnumType
  createdAt: Date
  updatedAt: Date
}
