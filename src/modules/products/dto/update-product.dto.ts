import * as joi from "joi"

import { PartialType } from "@nestjs/mapped-types"
import { CreateProductDto } from "./create-product.dto"
import { CategoriesArray } from "@/modules/common/types"

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export const updateProductSchema = joi.object({
  name: joi.string().optional(),
  price: joi.number().optional(),
  weight: joi.number().optional(),
  fragile: joi.boolean().optional(),
  categories: joi.array().items(joi.string().valid(CategoriesArray)).optional(),
  description: joi.string().optional(),
  discountPrice: joi
    .number()
    .optional()
    .when("price", {
      is: joi.exist(),
      then: joi.number().max(joi.ref("price")).messages({
        "number.max": "Discount price cannot be greater than the original price"
      })
    }),
  stockCount: joi.number().optional(),
  status: joi.string().valid("draft", "published").optional(),
  images: joi.array().min(1).max(5).items(joi.string()).optional()
})
