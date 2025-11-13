import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IBusinessResponse } from "./business-response.interface"

export type IBusinessesResponse = PaginatedResult<IBusinessResponse>
