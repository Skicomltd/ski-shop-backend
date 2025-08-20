import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Between, EntityManager, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"

import { Commision } from "./entities/commision.entity"
import { SettingsService } from "../settings/settings.service"
import { CreateCommisionDto } from "./dto/create-commision.dto"
import { UpdateCommisionDto } from "./dto/update-commision.dto"
import { OrderItem } from "../orders/entities/order-item.entity"
import { CommisionRevenueInterface, MonthlyCommisionRevenue } from "./interface/commision-revenue.interface"

@Injectable()
export class CommisionsService implements IService<Commision> {
  constructor(
    @InjectRepository(Commision) private readonly commisionRepository: Repository<Commision>,
    private readonly settingsService: SettingsService
  ) {}

  async create(createCommisionDto: CreateCommisionDto, manager?: EntityManager): Promise<Commision> {
    const repo = manager ? manager.getRepository<Commision>(Commision) : this.commisionRepository
    const createCommision = repo.create({ ...createCommisionDto })

    return await repo.save(createCommision)
  }

  async find(data?: FindOptionsWhere<Commision>): Promise<[Commision[], number]> {
    return await this.commisionRepository.findAndCount({ where: data })
  }

  async findOne(filter: FindOptionsWhere<Commision>) {
    return this.commisionRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Commision>): Promise<boolean> {
    return await this.commisionRepository.exists({ where: filter })
  }

  async findById(id: string): Promise<Commision> {
    return await this.commisionRepository.findOne({ where: { id: id } })
  }

  async update(entity: Commision, data: UpdateCommisionDto, manager?: EntityManager): Promise<Commision> {
    const repo = manager ? manager.getRepository<Commision>(Commision) : this.commisionRepository
    const merge = repo.create({ ...entity, ...data })
    return await repo.save(merge)
  }

  async remove(filter: FindOptionsWhere<Commision>): Promise<number> {
    const Commision = await this.commisionRepository.delete(filter)
    return Commision.affected
  }

  async calculateAdsTotalRevenue({ startDate, endDate }: CommisionRevenueInterface): Promise<number> {
    const where: FindOptionsWhere<Commision> = {}

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate)
    }

    if (endDate) {
      where.createdAt = LessThanOrEqual(endDate)
    }

    const result = await this.commisionRepository.sum("amount", where)

    return result
  }

  async getCommisionMonthlyRevenue({ startDate, endDate, status }: CommisionRevenueInterface): Promise<MonthlyCommisionRevenue[]> {
    const result = await this.commisionRepository
      .createQueryBuilder("commision")
      .select("EXTRACT(YEAR FROM commision.createdAt)::integer", "year")
      .addSelect("EXTRACT(MONTH FROM commision.createdAt)::integer", "month")
      .addSelect("SUM(commision.commisionFee)", "total")
      .where("commision.commisionStatus = :status", { status })
      .andWhere("commision.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate
      })
      .groupBy("year, month")
      .orderBy("year, month", "ASC")
      .getRawMany()

    const monthlyData = result.map((row) => ({
      year: row.year,
      month: row.month,
      total: parseFloat(row.total) || 0
    }))

    return monthlyData
  }

  async calculateOrderItemCommission(orderItem: OrderItem) {
    const amount = orderItem.quantity * orderItem.unitPrice
    const settings = await this.settingsService.findOneSetting()
    const commission = (settings.revenueSetting.fulfillmentFeePercentage / 100) * amount
    return commission
  }
}
