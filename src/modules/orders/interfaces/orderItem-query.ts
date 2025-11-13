import { FindOptionsWhere } from "typeorm"

import { PaginationParams } from "@services/pagination/interfaces/pagination-params.interface"
import { OrderItem } from "../entities/order-item.entity"
import { OrderStatus } from "./order-status"

export interface IOrderItemQuery extends PaginationParams, FindOptionsWhere<OrderItem> {
  take?: number
  orderStatus?: OrderStatus
}
