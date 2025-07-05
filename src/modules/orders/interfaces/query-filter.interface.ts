import { FindOptionsWhere } from "typeorm"

import { Order } from "../entities/order.entity"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

export interface IOrdersQuery extends PaginationParams, FindOptionsWhere<Order> {}
