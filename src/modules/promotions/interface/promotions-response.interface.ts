import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IPromotionResponse } from "./promotion-response.interface"

export type IPromotionsResponse = PaginatedResult<IPromotionResponse>
