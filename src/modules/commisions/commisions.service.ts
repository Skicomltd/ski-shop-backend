import { Injectable } from "@nestjs/common"
import { CreateCommisionDto } from "./dto/create-commision.dto"
import { UpdateCommisionDto } from "./dto/update-commision.dto"
import { Commision } from "./entities/commision.entity"
import { Between, EntityManager, FindOptionsWhere, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { CommisionRevenueInterface, MonthlyCommisionRevenue } from "./interface/commision-revenue.interface"

@Injectable()
export class CommisionsService implements IService<Commision> {
  constructor(@InjectRepository(Commision) private readonly commisionRepository: Repository<Commision>) {}

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

  async calculateAdsTotalRevenue({ startDate, endDate, status }: CommisionRevenueInterface): Promise<number> {
    const where: FindOptionsWhere<Commision> = {}

    if (status) {
      const stats = status.toString().split(",")
      where.commisionStatus = In(stats)
    }

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate)
    }

    if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate)
    }

    if (endDate) {
      where.createdAt = LessThanOrEqual(endDate)
    }

    const result = await this.commisionRepository.sum("commisionFee", where)

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
}
