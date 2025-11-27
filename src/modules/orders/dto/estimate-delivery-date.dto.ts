import * as joi from "joi"

export class EstimateDeliveryDateDto {
  pickUpState: string
  dropOffState: string
}

export const estimateDeliveryDateSchema = joi.object<EstimateDeliveryDateDto>({
  pickUpState: joi.string().required(),
  dropOffState: joi.string().required()
})
