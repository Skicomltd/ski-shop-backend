import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IPayoutResponse } from "./payout-response.interface"

export type IPayoutResponses = PaginatedResult<IPayoutResponse>
