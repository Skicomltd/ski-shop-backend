import { User } from "@/modules/users/entity/user.entity"
import { CartItems } from "../entities/cartItmes.entity"
import * as joi from "joi"

export class CreateCartDto {
  user: User
  cartItems: Partial<CartItems>[]
  total: number
  product: [
    {
      slug: string
      quantity: number
    }
  ]
}

export const createCartSchema = joi.object({
  total: joi.number().required(),
  product: joi
    .array()
    .items(
      joi.object({
        slug: joi.string().required(),
        quantity: joi.number().required().default(1)
      })
    )
    .min(1)
    .required()
})
