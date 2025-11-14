import { ADDRESS_STATUS } from "../enum/address.status"
import { address_status } from "../interface/address-status.interface"
import * as joi from "joi"

export class CreateAddressDto {
    name: string
    address: string
    city: string
    state: string
    phoneNumber: string
    status: address_status
}


export const createAddressSchema = joi.object<CreateAddressDto>({
    name: joi.string().required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    phoneNumber: joi.string().required(),
    status: joi.string().valid(...ADDRESS_STATUS).required()
})