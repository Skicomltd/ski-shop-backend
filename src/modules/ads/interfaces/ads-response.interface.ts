import { IAdResponse } from "./ad-response.interface"
import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"

export type IAdsResponse = PaginatedResult<IAdResponse>
