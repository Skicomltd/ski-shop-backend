import { Injectable } from "@nestjs/common"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto"
import { Subscription } from "./entities/subscription.entity"
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { ISubscriptionsQuery } from "./interface/query-filter.interface"

@Injectable()
export class SubscriptionService implements IService<Subscription> {
  constructor(@InjectRepository(Subscription) private subscriptionRepository: Repository<Subscription>) {}

  async create(data: CreateSubscriptionDto, manager?: EntityManager): Promise<Subscription> {
    const repo = manager ? manager.getRepository<Subscription>(Subscription) : this.subscriptionRepository

    const createSubcription = repo.create({ ...data })

    const subscription = await repo.save(createSubcription)

    return subscription
  }

  async find({ page, limit, planType, status, vendorId }: ISubscriptionsQuery): Promise<[Subscription[], number]> {
    const where: FindManyOptions<Subscription>["where"] = {}

    if (planType) {
      where.planType = planType
    }

    if (status) {
      where.status = status
    }

    if (vendorId) {
      where.vendorId = vendorId
    }

    return await this.subscriptionRepository.findAndCount({
      where,
      take: limit,
      skip: page ? page - 1 : undefined,
      relations: ["vendor", "vendor.business", "vendor.business.store", "vendor.business.store.product"]
    })
  }

  async findById(id: string): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({ where: { id: id } })
  }

  async findOne(filter: FindOptionsWhere<Subscription>): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({ where: filter, relations: ["vendor", "vendor.business", "vendor.business.store"] })
  }

  async exists(filter: FindOptionsWhere<Subscription>): Promise<boolean> {
    return await this.subscriptionRepository.exists({ where: filter, relations: ["vendor", "vendor.business", "vendor.business.store"] })
  }

  async update(entity: Subscription, data: UpdateSubscriptionDto, manager?: EntityManager): Promise<Subscription> {
    const repo = manager ? manager.getRepository(Subscription) : this.subscriptionRepository

    const update = repo.create({ ...entity, ...data })

    return await repo.save(update)
  }

  async remove(filter: FindOptionsWhere<Subscription>): Promise<number> {
    const result = await this.subscriptionRepository.delete(filter)
    return result.raw
  }

  async getStartAndEndDate(planType: string) {
    const startDate = new Date()
    let endDate: Date
    if (planType === "monthly") {
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 1))
    } else if (planType === "quarterly") {
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 3))
    } else if (planType === "annually") {
      endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1))
    }

    return { startDate, endDate }
  }
}
