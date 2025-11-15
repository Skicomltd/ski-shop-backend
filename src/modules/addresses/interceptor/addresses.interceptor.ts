import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { extend } from "joi";
import { AddressResponseMapper } from "../interface/address-response-mapper";
import { IAddressesResponse } from "../interface/addresses-response.interface";
import { Address } from "../entities/address.entity";
import { map, Observable } from "rxjs";
import { PaginationService } from "@/services/pagination";
import { IAddressResponse } from "../interface/address-response.interface";

type Payload = [Address[], number];

@Injectable()
export class AddressesResponseInterceptor extends AddressResponseMapper implements NestInterceptor<Payload, IAddressesResponse> {
    constructor(private paginationService: PaginationService) {
        super()
    }

    intercept(context: ExecutionContext, next: CallHandler<Payload>): Observable<IAddressesResponse> | Promise<Observable<IAddressesResponse>> {
         const request = context.switchToHttp().getRequest()
         const {page, limit} = request.query
        
         return next.handle().pipe(map((data) => this.paginate(data, { page, limit })))
    }

    paginate([addresses, total]: Payload, params: {page: number, limit: number}):IAddressesResponse {
        const data = addresses.map((address) => this.transform(address))
        return this.paginationService.paginate<IAddressResponse>(data, total, params)
    }
}