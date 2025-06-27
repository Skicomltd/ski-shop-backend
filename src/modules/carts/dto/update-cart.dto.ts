import { PartialType } from "@nestjs/mapped-types"
import { CreateCartDto } from "./create-cart.dto"
import * as joi from "joi"

export class UpdateCartDto extends PartialType(CreateCartDto) {}

export const updateCartSchema = joi.object({
  total: joi.number().optional(),
  product: joi
    .array()
    .items(
      joi.object({
        slug: joi.string().optional(),
        quantity: joi.number().optional()
      })
    )
    .optional()
})
