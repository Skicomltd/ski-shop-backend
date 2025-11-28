import { FindOptionsWhere } from "typeorm"

import { Order } from "../entities/order.entity"
import { PaginationParams } from "@services/pagination/interfaces/pagination-params.interface"
import { OrderDeliveryStatus } from "./delivery-status"

export interface IOrdersQuery extends PaginationParams, FindOptionsWhere<Order> {
  storeId?: string
  productId?: string
  startDate?: Date
  endDate?: Date
  orderBy?: "ASC" | "DESC"
  search?: string
  deliveryStatus?: OrderDeliveryStatus
}
