import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { IAddressQuery } from './interface/query-filter.interface';

@Injectable()
export class AddressesService implements IService<Address> {
 constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) {}


  async create(data: CreateAddressDto, manager?: EntityManager): Promise<Address> {
    const repo = manager ? manager.getRepository<Address>(Address) : this.addressRepository

    const createAddress = repo.create({ ...data })
    return await repo.save(createAddress)
  }


  async find({limit, page, flag, userId}: IAddressQuery): Promise<[Address[], number]> {
    const query = this.addressRepository.createQueryBuilder('address')

    if (flag === "default") {
      query.andWhere("address.default = :default", { default: true })
    }

    if (userId) {
      query.andWhere("address.userId = :userId", { userId })
    }

    return await query
      .take(limit)
      .skip(page && page > 0 ? (page - 1) * limit : 0)
      .getManyAndCount()
                                        
  }


  async findById(id: string): Promise<Address> {
    return await this.addressRepository.findOne({where: { id }})
  }

  async findOne(filter: FindOptionsWhere<Address>): Promise<Address> {
    return await this.addressRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Address>): Promise<boolean> {
    return await this.addressRepository.exists({ where: filter })
  }


  async update(entity: Address, data: UpdateAddressDto, manager?: EntityManager): Promise<Address> {
    const repo = manager ? manager.getRepository<Address>(Address) : this.addressRepository
    const merge = repo.merge(entity, data)
    return await repo.save(merge)
  }

  async remove(filter: FindOptionsWhere<Address>): Promise<number> {
    const deletedResult = await this.addressRepository.delete(filter)
    return deletedResult.affected  || 0
  }

 
}
