import * as joi from "joi"

export class ReplaceImageDto {
  url: string
}

export const replaceImageSchema = joi.object({
  url: joi.string().required()
})
