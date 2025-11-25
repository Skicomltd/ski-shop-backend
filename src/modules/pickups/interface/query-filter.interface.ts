import { PaginationParams } from "@/services/pagination"
import { FindOptionsWhere } from "typeorm"
import { Pickup } from "../entities/pickup.entity"

export interface IPickupQuery extends PaginationParams, FindOptionsWhere<Pickup> {
  search?: string
}
