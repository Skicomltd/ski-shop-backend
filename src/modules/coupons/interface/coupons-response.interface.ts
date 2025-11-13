import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { ICouponResponse } from "./coupon-response.interface"

export type ICouponsResponse = PaginatedResult<ICouponResponse>
