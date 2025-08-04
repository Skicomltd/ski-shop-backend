import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import { User } from "../entity/user.entity"

export interface IUserQuery extends PaginationParams, FindOptionsWhere<User> {
  startDate?: string
  endDate?: string
}
