import * as Joi from "joi"
import { PAYMENT_METHODS, PaymentMethod } from "../../orders/interfaces/payment-method.interface"

export class CheckoutDto {
  paymentMethod: PaymentMethod
}

export const checkoutSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required()
})
