import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { AddressResponseMapper } from "../interface/address-response-mapper";
import { Address } from "../entities/address.entity";
import { IAddressResponse } from "../interface/address-response.interface";
import { map, Observable } from "rxjs";

@Injectable()
export class AddressResponseInterceptor extends AddressResponseMapper implements NestInterceptor<Address, IAddressResponse> {
    intercept(__context: ExecutionContext, next: CallHandler<Address>): Observable<IAddressResponse> | Promise<Observable<IAddressResponse>> {
        return next.handle().pipe(map((data) => this.transform(data)))
    }
    
}