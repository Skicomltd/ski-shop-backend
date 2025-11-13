import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IBankResponse } from "./bank-response.interface"

export type IBanksResponse = PaginatedResult<IBankResponse>
