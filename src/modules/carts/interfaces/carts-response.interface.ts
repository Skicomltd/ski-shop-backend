import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { ICartResponse } from "./cart-response.interface"

export type ICartsResponse = PaginatedResult<ICartResponse>
