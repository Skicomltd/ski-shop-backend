import { FindOptionsWhere } from "typeorm"
import { Ads } from "../entities/promotion-ad.entity"
import { PaginationParams } from "@/modules/services/pagination/interfaces/paginationParams.interface"

export interface IPromotionAdsQuery extends PaginationParams, FindOptionsWhere<Ads> {}
