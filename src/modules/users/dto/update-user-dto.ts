import { PartialType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./create-user-dto"
import * as joi from "joi"

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export const updateUserSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  password: joi.string(),
  role: joi.string().valid("customer", "vendor", "admin"),
  address: joi.string().optional()
})
