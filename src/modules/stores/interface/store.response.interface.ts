import Business from "@/modules/users/entity/business.entity"
import { vendonEnumType } from "../entities/store.entity"
import { ProductCategoriesEnum } from "@/modules/common"

export interface StoreResponse {
  id: string
  name: string
  description: string
  categories: ProductCategoriesEnum[]
  business: Business
  type: vendonEnumType
  createdAt: Date
  updatedAt: Date
}
