import * as joi from "joi"
import { PLAN_METHOD } from "../interface/plan-method.interface"

export class CreatePlanDto {
  amount: number
  name: string
  interval: string
  planCode: string
  savingPercentage?: number
}

export const createPlanSchema = joi.object({
  amount: joi.number().required(),
  name: joi.string().required(),
  interval: joi
    .string()
    .valid(...PLAN_METHOD)
    .required(),
  savingPercentage: joi.number().optional()
})
