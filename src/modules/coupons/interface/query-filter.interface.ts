import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { FindOptionsWhere } from "typeorm"
import { Coupon } from "../entities/coupon.entity"

export interface ICouponsQuery extends PaginationParams, FindOptionsWhere<Coupon> {}
