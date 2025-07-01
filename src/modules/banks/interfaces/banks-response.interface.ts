import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IBankResponse } from "./bank-response.interface"

export type IBanksResponse = PaginatedResult<IBankResponse>
