import { UserRoleEnum } from "../entity/user.entity"
import * as joi from "joi"

export class CreateUserDto {
  firstName: string
  lastName: string
  password: string
  role: UserRoleEnum
  email: string
  isEmailVerified?: boolean
  itemsCount?: number
  ordersCount?: number
}

export const createUserSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid("customer", "vendor", "admin")
})
