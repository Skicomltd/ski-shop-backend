import { PartialType } from "@nestjs/mapped-types"
import { CreatePromotionAdDto } from "./create-promotion-ad.dto"

export class UpdatePromotionAdDto extends PartialType(CreatePromotionAdDto) {}
