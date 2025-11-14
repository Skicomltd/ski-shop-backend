import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { PickupResponseMapper } from "../interface/pickup-response-mapper";
import { Pickup } from "../entities/pickup.entity";
import { IPickupResponse } from "../interface/pickup-response.interface";
import { map, Observable } from "rxjs";

@Injectable()
export class PickupResponseInterceptor extends PickupResponseMapper implements NestInterceptor<Pickup, IPickupResponse> {
    intercept(__context: ExecutionContext, next: CallHandler<Pickup>): Observable<IPickupResponse> | Promise<Observable<IPickupResponse>> {
        return next.handle().pipe(map((data) => this.transform(data)))
    }
    
}