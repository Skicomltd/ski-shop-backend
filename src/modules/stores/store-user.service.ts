import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { StoreUser } from "./entities/store-user.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"

@Injectable()
export class StoreUserService implements IService<StoreUser> {
  constructor(
    @InjectRepository(StoreUser)
    private readonly storeUserRepository: Repository<StoreUser>
  ) {}

  private readonly relations = ["user", "store"]

  async create(data: Partial<StoreUser>, manager?: EntityManager): Promise<StoreUser> {
    const repo = manager ? manager.getRepository(StoreUser) : this.storeUserRepository
    const entity = repo.create({ ...data })
    return await repo.save(entity)
  }

  async find(data: { limit?: number; page?: number; userId?: string; storeId?: string; role?: string }): Promise<[StoreUser[], number]> {
    const { limit, page, userId, storeId, role } = data || {}

    const query = this.storeUserRepository
      .createQueryBuilder("storeUser")
      .leftJoinAndSelect("storeUser.user", "user")
      .leftJoinAndSelect("storeUser.store", "store")

    if (userId) {
      query.andWhere("storeUser.userId = :userId", { userId })
    }

    if (storeId) {
      query.andWhere("storeUser.storeId = :storeId", { storeId })
    }

    if (role) {
      query.andWhere("storeUser.role = :role", { role })
    }

    if (limit) {
      query.take(limit)
      query.skip(page && page > 0 ? (page - 1) * limit : 0)
    }

    return await query.getManyAndCount()
  }

  async findById(id: string): Promise<StoreUser> {
    return await this.storeUserRepository.findOne({
      where: { id },
      relations: this.relations
    })
  }

  async findOne(filter: FindOptionsWhere<StoreUser>): Promise<StoreUser> {
    return await this.storeUserRepository.findOne({
      where: filter,
      relations: this.relations
    })
  }

  async exists(filter: FindOptionsWhere<StoreUser>): Promise<boolean> {
    return await this.storeUserRepository.exists({ where: filter })
  }

  async update(entity: StoreUser, data: Partial<StoreUser>, manager?: EntityManager): Promise<StoreUser> {
    const repo = manager ? manager.getRepository(StoreUser) : this.storeUserRepository
    const merged = repo.merge(entity, data)
    return await repo.save(merged)
  }

  async remove(filter: FindOptionsWhere<StoreUser>): Promise<number> {
    const result = await this.storeUserRepository.delete(filter)
    return result.affected || 0
  }
}
