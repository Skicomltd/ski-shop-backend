import { Injectable } from "@nestjs/common"
import { CreatePromotionAdDto } from "./dto/create-promotion-ad.dto"
import { UpdatePromotionAdDto } from "./dto/update-promotion-ad.dto"
import { Ads } from "./entities/promotion-ad.entity"
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IPromotionAdsQuery } from "./interface/query-interface-filter"

@Injectable()
export class PromotionAdsService implements IService<Ads> {
  constructor(@InjectRepository(Ads) private promotionAdRepository: Repository<Ads>) {}

  async create(data: CreatePromotionAdDto, manager?: EntityManager): Promise<Ads> {
    const repo = manager ? manager.getRepository(Ads) : this.promotionAdRepository
    const promotionAd = repo.create(data)
    return await repo.save(promotionAd)
  }

  async find({ productId, vendorId, type, limit, page }: IPromotionAdsQuery): Promise<[Ads[], number]> {
    const where: FindManyOptions<Ads>["where"] = {}

    if (productId) {
      where.productId = productId
    }

    if (vendorId) {
      where.vendorId = vendorId
    }

    if (type) {
      where.type = type
    }

    return await this.promotionAdRepository.findAndCount({
      where,
      take: limit,
      skip: page ? page - 1 : undefined
    })
  }

  async findById(id: string): Promise<Ads> {
    return await this.promotionAdRepository.findOne({ where: { id: id } })
  }

  async findOne(filter: FindOptionsWhere<Ads>): Promise<Ads> {
    return await this.promotionAdRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Ads>): Promise<boolean> {
    return await this.promotionAdRepository.exists({ where: filter })
  }

  async update(entity: Ads, data: UpdatePromotionAdDto, manager?: EntityManager): Promise<Ads> {
    const repo = manager ? manager.getRepository(Ads) : this.promotionAdRepository
    const updatedEntity = repo.merge(entity, data)
    return await repo.save(updatedEntity)
  }

  async remove(filter: FindOptionsWhere<Ads>): Promise<number> {
    const result = await this.promotionAdRepository.delete(filter)
    return result.affected || 0
  }

  async calculateStartAndEndDate(duration: number): Promise<{ startDate: Date; endDate: Date }> {
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (duration - 1))
    return { startDate, endDate }
  }
}
