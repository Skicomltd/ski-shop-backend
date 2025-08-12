import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { ICouponResponse } from "./coupon-response.interface"

export type ICouponsResponse = PaginatedResult<ICouponResponse>
