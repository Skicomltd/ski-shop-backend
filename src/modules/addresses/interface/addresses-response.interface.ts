import { PaginatedResult } from "@/services/pagination";
import { IAddressResponse } from "./address-response.interface";

export type IAddressesResponse = PaginatedResult<IAddressResponse>