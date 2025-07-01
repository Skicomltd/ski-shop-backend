import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { ICartResponse } from "./cart-response.interface"

export type ICartsResponse = PaginatedResult<ICartResponse>
