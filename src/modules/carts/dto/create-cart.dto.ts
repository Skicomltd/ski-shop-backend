import { User } from "@/modules/users/entity/user.entity"
import { CartItems } from "../entities/cartItmes.entity"
import * as joi from "joi"

export class CreateCartDto {
  user: User
  cartItems: CartItems[]
  total: number
  slug: string
  quantity: number
}

export const createCartSchema = joi.object({
  total: joi.number().required(),
  quantity: joi.number().default(1),
  slug: joi.string().required()
})
