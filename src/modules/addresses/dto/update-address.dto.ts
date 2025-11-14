import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import * as joi from "joi"
import { ADDRESS_STATUS } from '../enum/address.status';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}


export const updateAddressSchema = joi.object<UpdateAddressDto>({
    name: joi.string().optional(),
    address: joi.string().optional(),   
    city: joi.string().optional(),  
    state: joi.string().optional(),  
    phoneNumber: joi.string().optional(),
    status: joi.string().valid(...ADDRESS_STATUS).optional()   
})