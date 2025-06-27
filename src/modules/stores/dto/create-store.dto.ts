import Business from "@/modules/users/entity/business.entity"
import * as Joi from "joi"
import { vendonEnumType } from "../entities/store.entity"

export class CreateStoreDto {
  name: string
  description: string
  logo: string
  type: vendonEnumType
  category: string
  business: Business
}

export const storeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required()
})
