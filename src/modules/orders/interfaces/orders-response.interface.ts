import { IOrderResponse } from "./order-response.interface"
import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"

export type IOrdersResponse = PaginatedResult<IOrderResponse>
