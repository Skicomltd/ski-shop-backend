import * as joi from "joi"

export class SaveProductDto {
  productId: string
}

export const saveProductSchema = joi.object({
  productId: joi.string().required()
})
