import { Store } from "../entities/store.entity"
import { StoreResponse } from "./store.response.interface"

export abstract class StoreResponseMapper implements IInterceptor {
  transform(data: Store): StoreResponse {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      logo: data.logo,
      business: data.business,
      isStarSeller: data.isStarSeller,
      createdAt: data.createdAt,
      updatedAt: data.updateAt,
      type: data.type
    }
  }
}
