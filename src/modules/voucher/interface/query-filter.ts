import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { Voucher } from "../entities/voucher.entity"
import { FindOptionsWhere } from "typeorm"

export interface IVoucherQueryFilter extends PaginationParams, FindOptionsWhere<Voucher> {}
