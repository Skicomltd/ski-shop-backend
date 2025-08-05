import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import { Payout } from "../entities/payout.entity"

export interface IPayoutQuery extends PaginationParams, FindOptionsWhere<Payout> {
  flag?: "isPending"
}
