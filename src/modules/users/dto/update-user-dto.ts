import { PartialType } from "@nestjs/mapped-types"
import { CreateUserDto } from "./create-user-dto"
import * as joi from "joi"

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export const updateUserSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().valid("customer", "vendor", "admin")
})
