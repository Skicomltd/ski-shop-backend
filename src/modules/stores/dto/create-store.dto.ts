import Business from "@/modules/users/entity/business.entity"
import * as Joi from "joi"
import { vendonEnumType } from "../entities/store.entity"
import { ProductCategoriesEnum } from "@/modules/common/types"

export class CreateStoreDto {
  name: string
  description: string
  logo: string
  type: vendonEnumType
  category: ProductCategoriesEnum
  business: Business
}

export const createStoreSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.string()
    .valid("clothings", "gadgets", "groceries", "women", "bodyCreamAndOil", "furniture", "tvAndHomeAppliances", "watchesAndAccessories")
    .required(),
  type: Joi.string().valid("premium", "skishop", "basic").default("basic")
})
