import * as joi from "joi"

export class InviteStoreDto {
  email: string
}

export const inviteStoreSchema = joi.object({
  email: joi.string().email().required()
})
