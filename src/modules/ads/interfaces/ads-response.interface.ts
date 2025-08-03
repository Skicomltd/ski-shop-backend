import { IAdResponse } from "./ad-response.interface"
import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"

export type IAdsResponse = PaginatedResult<IAdResponse>
