import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import { Earning } from "../entities/earning.entity"

export interface IEarningQuery extends PaginationParams, FindOptionsWhere<Earning> {}
