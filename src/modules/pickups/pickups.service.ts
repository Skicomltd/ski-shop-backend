import { Injectable } from '@nestjs/common';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Pickup } from './entities/pickup.entity';

@Injectable()
export class PickupsService implements IService<Pickup> {
  constructor(
    @InjectRepository(Pickup) private pickupRepository: Repository<Pickup>
  ) {}

  async create(data: CreatePickupDto, manager?: EntityManager): Promise<Pickup> {
const repo = manager ? manager.getRepository<Pickup>(Pickup) : this.pickupRepository

    const createUser = repo.create({ ...data })
    return await repo.save(createUser)
  }

  async find(): Promise<[Pickup[], number]> {
    return await this.pickupRepository.findAndCount();
  }

  async findById(id: string): Promise<Pickup> {
    return await this.pickupRepository.findOne({ where: { id } });
  }

  async findOne(filter: FindOptionsWhere<Pickup>): Promise<Pickup> {
    return await this.pickupRepository.findOne({ where: filter });
  }

  async exists(filter: FindOptionsWhere<Pickup>): Promise<boolean> {
    return this.pickupRepository.exists({ where: filter });
  }

  async update(entity: Pickup, data: UpdatePickupDto, manager?: EntityManager): Promise<Pickup> {
    const repo = manager ? manager.getRepository<Pickup>(Pickup) : this.pickupRepository
    const merge = repo.merge(entity, data)
    return await repo.save(merge)
  }

  async remove(filter: FindOptionsWhere<Pickup>): Promise<number> {
    const deleteResult = await this.pickupRepository.delete(filter)
    return deleteResult.affected || 0
  }
}
