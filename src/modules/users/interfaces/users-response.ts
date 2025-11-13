import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IUserResponse } from "./user-response"

export type IUsersResponse = PaginatedResult<IUserResponse>
