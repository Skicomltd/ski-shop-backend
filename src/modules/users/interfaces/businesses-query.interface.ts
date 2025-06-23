import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import Business from "../entity/business.entity"

export interface IBusinessQuery extends PaginationParams, FindOptionsWhere<Business> {}
