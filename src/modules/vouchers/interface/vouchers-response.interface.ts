import { PaginatedResult } from "@/modules/services/pagination/interfaces/paginationResult.interface"
import { IVoucherResponse } from "./voucher-response.interface"

export type IVouchersResponse = PaginatedResult<IVoucherResponse>
