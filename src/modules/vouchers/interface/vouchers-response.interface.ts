import { PaginatedResult } from "@services/pagination/interfaces/pagination-result.interface"
import { IVoucherResponse } from "./voucher-response.interface"

export type IVouchersResponse = PaginatedResult<IVoucherResponse>
