import Business from "@/modules/users/entity/business.entity"
import * as Joi from "joi"

export class CreateStoreDto {
  name: string
  description: string
  logo: string
  category: string
  business: Business
}

export const storeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required()
})
