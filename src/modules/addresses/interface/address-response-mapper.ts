import { Address } from "../entities/address.entity";
import { IAddressResponse } from "./address-response.interface";

export abstract class AddressResponseMapper implements IInterceptor {
    transform(data: Address): IAddressResponse {
        return {
            id: data.id,
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            phoneNumber: data.phoneNumber,
            status: data.status
        }
    }
}