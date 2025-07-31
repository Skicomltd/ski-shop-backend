import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"

import { Payout } from "./entities/payout.entity"

@Injectable()
export class PayoutsService implements IService<Payout> {
  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>
  ) {}

  async create(data: Partial<Payout>, manager?: EntityManager): Promise<Payout> {
    const repo = manager ? manager.getRepository(Payout) : this.payoutRepository
    const payout = repo.create(data)
    return repo.save(payout)
  }

  async find(where: FindOptionsWhere<Payout>): Promise<[Payout[], number]> {
    return this.payoutRepository.findAndCount({ where })
  }

  async findById(id: string): Promise<Payout> {
    return this.payoutRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Payout>): Promise<Payout> {
    return this.payoutRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Payout>): Promise<boolean> {
    const count = await this.payoutRepository.count({ where: filter })
    return count > 0
  }

  async update(entity: Payout, data: Partial<Payout>, manager?: EntityManager): Promise<Payout> {
    const repo = manager ? manager.getRepository(Payout) : this.payoutRepository
    Object.assign(entity, data)
    return repo.save(entity)
  }

  async remove(filter: FindOptionsWhere<Payout>): Promise<number> {
    const result = await this.payoutRepository.delete(filter)
    return result.affected || 0
  }
}
