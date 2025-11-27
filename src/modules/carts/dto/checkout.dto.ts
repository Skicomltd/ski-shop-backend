import * as Joi from "joi"
import { PAYMENT_METHODS, PaymentMethod } from "../../orders/interfaces/payment-method.interface"

export class CheckoutDto {
  paymentMethod: PaymentMethod
  address: string
  voucherId?: string
}

export const checkoutSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required(),
  address: Joi.string().required(),
  voucherId: Joi.string().uuid().optional()
})
