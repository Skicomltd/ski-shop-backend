import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { Subscription } from "@/modules/subscription/entities/subscription.entity"
import { FindOptionsWhere } from "typeorm"

export interface ISubscriptionsQuery extends PaginationParams, FindOptionsWhere<Subscription> {
  startDate?: Date
  endDate?: Date
}

export interface GetSubscriptionPayload {
  code: string
}
