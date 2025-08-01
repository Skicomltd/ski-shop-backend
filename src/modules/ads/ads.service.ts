import { Injectable } from "@nestjs/common"
import { CreateAdDto } from "./dto/create-ad.dto"
import { UpdateAdDto } from "./dto/update-ad.dto"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { Ad } from "./entities/ad.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { IAdsQuery } from "./interfaces/query-interface-filter"

@Injectable()
export class AdsService {
  constructor(@InjectRepository(Ad) private adRepository: Repository<Ad>) {}

  async create(data: CreateAdDto, manager?: EntityManager): Promise<Ad> {
    const repo = manager ? manager.getRepository(Ad) : this.adRepository
    const ad = repo.create(data)
    return await repo.save(ad)
  }

  async find({ productId, vendorId, type, storeId, limit, page }: IAdsQuery): Promise<[Ad[], number]> {
    const where: FindOptionsWhere<Ad> = {}

    if (productId) {
      where.productId = productId
    }

    if (vendorId) {
      where.vendorId = vendorId
    }

    if (type) {
      where.type = type
    }

    if (storeId) {
      where.product = { storeId }
    }

    return await this.adRepository.findAndCount({
      where,
      take: limit,
      skip: page ? page - 1 : undefined,
      relations: ["vendor", "product", "store"]
    })
  }

  async findById(id: string): Promise<Ad> {
    return await this.findOne({ id })
  }

  async findOne(filter: FindOptionsWhere<Ad>): Promise<Ad> {
    return await this.adRepository.findOne({ where: filter, relations: ["vendor", "product", "store"] })
  }

  async exists(filter: FindOptionsWhere<Ad>): Promise<boolean> {
    return await this.adRepository.exists({ where: filter })
  }

  async update(entity: Ad, data: UpdateAdDto, manager?: EntityManager): Promise<Ad> {
    const repo = manager ? manager.getRepository(Ad) : this.adRepository
    const updatedEntity = repo.merge(entity, data)
    return await repo.save(updatedEntity)
  }

  async remove(filter: FindOptionsWhere<Ad>): Promise<number> {
    const result = await this.adRepository.delete(filter)
    return result.affected || 0
  }

  async calculateStartAndEndDate(duration: number): Promise<{ startDate: Date; endDate: Date }> {
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (duration - 1))
    return { startDate, endDate }
  }
}
