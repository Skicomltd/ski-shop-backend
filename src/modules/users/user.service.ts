import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user-dto"
import { ConflictException } from "@/exceptions/conflict.exception"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { UpdateUserDto } from "./dto/update-user-dto"
import { User } from "./entity/user.entity"
import { IUserQuery } from "./interfaces/users-query.interface"

@Injectable()
export class UserService implements IService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(data: CreateUserDto, manager?: EntityManager): Promise<User> {
    const exist = await this.exists({ email: data.email })

    if (exist) throw new ConflictException("User exists")

    const repo = manager ? manager.getRepository<User>(User) : this.userRepository

    const createUser = repo.create({ ...data })
    return await repo.save(createUser)
  }

  async find(data: IUserQuery): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({ where: data, relations: ["business", "business.store"] })
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id }, relations: ["business", "business.store"] })
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: filter, relations: ["business", "business.store"] })
    if (!user) throw new BadReqException("User not found")
    return user
  }

  exists(filter: FindOptionsWhere<User>): Promise<boolean> {
    return this.userRepository.exists({ where: filter })
  }

  async update(entity: User, data: UpdateUserDto, manager?: EntityManager): Promise<User> {
    const repo = manager ? manager.getRepository<User>(User) : this.userRepository
    const merged = repo.merge(entity, data)
    return repo.save(merged)
  }

  async remove(filter: FindOptionsWhere<User>): Promise<number> {
    const result = await this.userRepository.delete(filter)

    return result.affected
  }
}
