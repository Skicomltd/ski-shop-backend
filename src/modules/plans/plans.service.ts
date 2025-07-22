import { Injectable } from "@nestjs/common"
import { CreatePlanDto } from "./dto/create-plan.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Plan } from "./entities/plan.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { UpdatePlanDto } from "./dto/update-plan.dto"

@Injectable()
export class PlansService implements IService<Plan> {
  constructor(@InjectRepository(Plan) private planRepository: Repository<Plan>) {}

  async create(data: CreatePlanDto, manager?: EntityManager): Promise<Plan> {
    const repo = manager ? manager.getRepository(Plan) : this.planRepository

    const createProduct = repo.create({ ...data })

    const product = await repo.save(createProduct)

    return product
  }

  async find(): Promise<[Plan[], number]> {
    return await this.planRepository.findAndCount()
  }

  async findById(id: string): Promise<Plan> {
    return await this.planRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Plan>): Promise<Plan> {
    return await this.planRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Plan>): Promise<boolean> {
    return await this.planRepository.exists({ where: filter })
  }

  async update(entity: Plan, data: UpdatePlanDto, manager?: EntityManager): Promise<Plan> {
    const repo = manager ? manager.getRepository(Plan) : this.planRepository

    const update = repo.create({ ...entity, ...data })

    return await repo.save(update)
  }

  async remove(filter: FindOptionsWhere<Plan>): Promise<number> {
    const result = await this.planRepository.delete(filter)
    return result.raw
  }
}
