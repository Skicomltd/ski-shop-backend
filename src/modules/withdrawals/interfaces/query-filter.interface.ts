import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import { Withdrawal } from "../entities/withdrawal.entity"

export interface IWithdrawalQuery extends PaginationParams, FindOptionsWhere<Withdrawal> {}
