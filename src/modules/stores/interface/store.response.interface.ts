import Business from "@/modules/users/entity/business.entity"
import { vendonEnumType } from "../entities/store.entity"

export interface StoreResponse {
  id: string
  name: string
  description: string
  category: string
  business: Business
  type: vendonEnumType
  createdAt: Date
  updatedAt: Date
}
