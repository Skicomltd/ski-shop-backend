import { Injectable } from "@nestjs/common"
import { CreateStoreDto } from "./dto/create-store.dto"
import { UpdateStoreDto } from "./dto/update-store.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Store } from "./entities/store.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"

@Injectable()
export class StoreService implements IService<Store> {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) {}

  async create(createStoreDto: CreateStoreDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository<Store>(Store) : this.storeRepository
    const store = repo.create({
      ...createStoreDto
    })
    return await repo.save(store)
  }

  async find(data?: FindOptionsWhere<Store>): Promise<[Store[], number]> {
    return await this.storeRepository.findAndCount({ where: data })
  }

  async findById(id: string): Promise<Store> {
    return await this.storeRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Store>) {
    return await this.storeRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Store>): Promise<boolean> {
    return this.storeRepository.exists({ where: filter })
  }

  async update(entity: Store, data: UpdateStoreDto, manager?: EntityManager): Promise<Store> {
    const repo = manager ? manager.getRepository<Store>(Store) : this.storeRepository
    await repo.update({ id: entity.id }, { ...data })
    return this.findOne({ id: entity.id })
  }

  async remove(filter: FindOptionsWhere<Store>): Promise<number> {
    const store = await this.storeRepository.delete(filter)
    return store.raw
  }
}
