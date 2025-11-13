import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IReviewResponse } from "./review-response-interface"

export type IReviewsResponse = PaginatedResult<IReviewResponse>
