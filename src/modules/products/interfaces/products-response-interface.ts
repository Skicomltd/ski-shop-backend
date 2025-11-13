import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IProductResponse } from "./product-response-interface"

export type IProductsResponse = PaginatedResult<IProductResponse>
