import { User } from "@/modules/users/entity/user.entity"
import { CartItems } from "../entities/cartItmes.entity"

export class CreateCartDto {
  user: User
  cartItems: CartItems[]
  total: number
}
