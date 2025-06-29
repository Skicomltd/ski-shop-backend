import { vendonEnumType } from "@/modules/stores/entities/store.entity"
import Business from "@/modules/users/entity/business.entity"
import * as Joi from "joi"

export class OnboardStoreDto {
  name: string
  description: string
  logo: string
  type: vendonEnumType
  business: Business
}

export const onboardStoreSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})
