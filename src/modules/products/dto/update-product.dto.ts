import * as joi from "joi"

import { PartialType } from "@nestjs/mapped-types"
import { CreateProductDto } from "./create-product.dto"

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export const updateProductSchema = joi.object({
  name: joi.string().optional(),
  price: joi.number().optional(),
  categories: joi
    .array()
    .items(
      joi.string().valid("clothings", "gadgets", "groceries", "women", "bodyCreamAndOil", "furniture", "tvAndHomeAppliances", "watchesAndAccessories")
    )
    .optional(),
  description: joi.string().optional(),
  discountPrice: joi.number().optional(),
  stockCount: joi.number().optional(),
  status: joi.string().valid("draft", "published").optional(),
  images: joi.array().min(1).max(5).items(joi.string()).optional()
})
