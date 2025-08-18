import { CommisionEnum } from "../enum/commision-enum"

export class CreateCommisionDto {
  commisionFee: number
  commisionValue: number
  orderId: string
  storeId: string
  commisionStatus?: CommisionEnum
}
