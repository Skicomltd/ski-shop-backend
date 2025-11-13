import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IContactUsResponse } from "./contact-us-response.interface"

export type IContactsUsResponse = PaginatedResult<IContactUsResponse>
