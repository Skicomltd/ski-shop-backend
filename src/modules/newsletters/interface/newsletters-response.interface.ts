import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { INewsletterResponse } from "./newsletter-response.interface"

export type INewsLettersResponse = PaginatedResult<INewsletterResponse>
