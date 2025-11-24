import * as joi from "joi"
import { UserRoleEnum } from "../entity/user.entity"

export class CreateUserDto {
  firstName: string
  lastName: string
  password: string
  address?: string
  phoneNumber?: string
  profileImage?: string
  role: UserRoleEnum
  fcmToken?: string[]
  email: string
  isEmailVerified?: boolean
  isPhoneNumberVerified?: boolean
  itemsCount?: number
  ordersCount?: number
}

export const createUserSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid("customer", "vendor", "admin"),
  address: joi.string().optional()
})
