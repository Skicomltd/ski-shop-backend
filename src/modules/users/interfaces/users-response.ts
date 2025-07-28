import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IUserResponse } from "./user-response"

export type IUsersResponse = PaginatedResult<IUserResponse>
