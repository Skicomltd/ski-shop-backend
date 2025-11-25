import * as joi from "joi"

export class CreateAddressDto {
    name: string
    address: string
    userId: string
    city: string
    state: string
    phoneNumber: string
    default: boolean
}


export const createAddressSchema = joi.object<CreateAddressDto>({
    name: joi.string().required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    phoneNumber: joi.string().required(),
    default: joi.boolean().default(true)
})