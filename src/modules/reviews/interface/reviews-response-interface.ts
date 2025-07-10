import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IReviewResponse } from "./review-response-interface"

export type IReviewsResponse = PaginatedResult<IReviewResponse>
