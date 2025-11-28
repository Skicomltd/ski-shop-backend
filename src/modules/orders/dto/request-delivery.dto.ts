import * as joi from "joi"

export class RequestDeliveryDto {
  orderId: string
  orderItemId: string
}

export const createRequestDeliverySchema = joi.object({
  orderId: joi.string().uuid().required(),
  orderItemId: joi.string().uuid().required()
})
