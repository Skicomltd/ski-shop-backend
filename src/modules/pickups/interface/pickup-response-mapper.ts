import { Pickup } from "../entities/pickup.entity"
import { IPickupResponse } from "./pickup-response.interface"

export abstract class PickupResponseMapper implements IInterceptor {
  transform(data: Pickup): IPickupResponse {
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contactPerson,
      address: data.address,
      phoneNumber: data.phoneNumber,
      status: data.status
    }
  }
}
