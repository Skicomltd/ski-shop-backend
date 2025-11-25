import { FindOptionsWhere } from "typeorm";
import { Address } from "../entities/address.entity";
import { PaginationParams } from "@/services/pagination";

export interface IAddressQuery extends PaginationParams, FindOptionsWhere<Address> {
    flag: "default"
}