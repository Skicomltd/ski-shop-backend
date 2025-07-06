import { IOrderResponse } from "./order-response.interface"
import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"

export type IOrdersResponse = PaginatedResult<IOrderResponse>
