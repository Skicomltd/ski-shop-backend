import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IContactUsResponse } from "./contactUs-response.interface"

export type IContactsUsResponse = PaginatedResult<IContactUsResponse>
