import * as Joi from "joi"
import { PAYMENT_METHODS, PaymentMethod } from "../../orders/interfaces/payment-method.interface"

export class CheckoutDto {
  paymentMethod: PaymentMethod
  shippingAddress: string
  shippingFee: number
  voucherId?: string
}

export const checkoutSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required(),
  shippingAddress: Joi.string().required(),
  shippingFee: Joi.number().required(),
  voucherId: Joi.string().uuid().optional()
})
