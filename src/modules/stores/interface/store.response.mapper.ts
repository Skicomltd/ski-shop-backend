import { Store } from "../entities/store.entity"
import { StoreResponse } from "./store.response.interface"

export abstract class StoreResponseMapper implements IInterceptor {
  transform(data: Store): StoreResponse {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      business: data.business,
      createdAt: data.createdAt,
      category: data.category,
      updatedAt: data.updateAt,
      type: data.type
    }
  }
}
