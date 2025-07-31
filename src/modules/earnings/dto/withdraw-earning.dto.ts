import * as Joi from "joi"

export class WithrawEarningDto {
  bankId: string
  amount: number
}

export const withdrawEarningSchema = Joi.object({
  bankId: Joi.string().uuid().required(),
  amount: Joi.number().min(0).max(10000000).required()
})
