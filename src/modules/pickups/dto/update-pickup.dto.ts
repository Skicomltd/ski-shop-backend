import { PartialType } from "@nestjs/mapped-types"
import { CreatePickupDto } from "./create-pickup.dto"
import * as joi from "joi"

export class UpdatePickupDto extends PartialType(CreatePickupDto) {}

export const updatePickupSchema = joi.object<UpdatePickupDto>({
  name: joi.string().optional(),
  contactPerson: joi.string().optional(),
  address: joi.string().optional(),
  phoneNumber: joi.string().optional(),
  status: joi.string().valid("active", "inactive").optional()
})
