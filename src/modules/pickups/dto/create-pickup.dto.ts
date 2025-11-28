import { pickup_status } from "../interface/pickup-status.interface"
import * as joi from "joi"

export class CreatePickupDto {
  name: string
  contactPerson: string
  address: string
  phoneNumber: string
  state: string
  deliveryCost: number
  status: pickup_status
}

export const createPickupSchema = joi.object<CreatePickupDto>({
  name: joi.string().required(),
  contactPerson: joi.string().required(),
  address: joi.string().required(),
  state: joi.string().required(),
  phoneNumber: joi.string().required(),
  status: joi.string().valid("active", "inactive").default("active").required()
})
