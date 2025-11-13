import { PaginationParams } from "@services/pagination/interfaces/pagination-params.interface"
import { FindOptionsWhere } from "typeorm"
import { User } from "../entity/user.entity"

export interface IUserQuery extends PaginationParams, FindOptionsWhere<User> {
  startDate?: string
  endDate?: string
  search?: string
  userId?: string
}
