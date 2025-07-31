import { Injectable } from "@nestjs/common"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"

import { Earning } from "./entities/earning.entity"
import { IEarningQuery } from "./interfaces/query-filter.interface"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class EarningsService implements IService<Earning> {
  constructor(@InjectRepository(Earning) private readonly earningsRepository: Repository<Earning>) {}

  async create(data: Partial<Earning>, manager?: EntityManager): Promise<Earning> {
    const repo = manager ? manager.getRepository(Earning) : this.earningsRepository
    const earning = repo.create(data)
    return repo.save(earning)
  }

  async find({ page: skip, limit: take }: IEarningQuery): Promise<[Earning[], number]> {
    return await this.earningsRepository.findAndCount({ take, skip })
  }

  async findById(id: string): Promise<Earning> {
    return this.findOne({ id })
  }

  async findOne(where: FindOptionsWhere<Earning>): Promise<Earning> {
    return await this.earningsRepository.findOne({ where })
  }

  async exists(filter: FindOptionsWhere<Earning>): Promise<boolean> {
    return this.earningsRepository.exists({ where: filter })
  }

  async update(entity: Earning, data: Partial<Earning>, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Earning) : this.earningsRepository
    const updatedEntity = repo.merge(entity, data)
    return repo.save(updatedEntity)
  }

  async remove(filter: FindOptionsWhere<Earning>): Promise<number> {
    const result = await this.earningsRepository.delete(filter)
    return result.affected
  }
}
