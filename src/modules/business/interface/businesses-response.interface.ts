import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IBusinessResponse } from "./business-response.interface"

export type IBusinessesResponse = PaginatedResult<IBusinessResponse>
