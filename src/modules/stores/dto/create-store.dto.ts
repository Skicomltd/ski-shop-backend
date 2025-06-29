import Business from "@/modules/users/entity/business.entity"
import * as Joi from "joi"
import { vendonEnumType } from "../entities/store.entity"

export class CreateStoreDto {
  name: string
  description: string
  logo: string
  type: vendonEnumType
  business: Business
}

export const createStoreSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("premium", "skishop", "basic").default("basic")
})
