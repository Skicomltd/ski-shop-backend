import Business from "@/modules/business/entities/business.entity"
import { vendonEnumType } from "../entities/store.entity"

export interface StoreResponse {
  id: string
  name: string
  description: string
  logo: string
  isStarSeller: boolean
  business: Business
  type: vendonEnumType
  createdAt: Date
  updatedAt: Date
}
