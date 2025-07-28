import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"
import { Subscription } from "@/modules/subscription/entities/subscription.entity"
import { FindOptionsWhere } from "typeorm"

export interface ISubscriptionsQuery extends PaginationParams, FindOptionsWhere<Subscription> {}

export interface GetSubscriptionPayload {
  code: string
}
