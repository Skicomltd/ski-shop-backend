import * as joi from "joi"

export class EstimateDeliveryDateDto {
  dropOffState: string
}

export const estimateDeliveryDateSchema = joi.object<EstimateDeliveryDateDto>({
  dropOffState: joi.string().required()
})
