import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user-dto"
import { UpdateUserDto } from "./dto/update-user-dto"
import { User, UserRoleEnum } from "./entity/user.entity"
import { IUserQuery } from "./interfaces/users-query.interface"
import { HeadersRecordsInterface } from "./interfaces/user-headers-records"
import { faker } from "@faker-js/faker"

@Injectable()
export class UserService implements IService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  private readonly relations = ["business", "business.store", "storeUsers"]

  async create(data: CreateUserDto, manager?: EntityManager): Promise<User> {
    const repo = manager ? manager.getRepository<User>(User) : this.userRepository
    const createUser = repo.create({ ...data })
    return await repo.save(createUser)
  }

  async findOrCreate(data: CreateUserDto, manager?: EntityManager): Promise<User> {
    const foundUser = await this.findOne({ email: data.email })
    if (foundUser) return foundUser

    return this.create(data, manager)
  }

  async find({ limit, page, role, search, status }: IUserQuery): Promise<[User[], number]> {
    const query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.business", "business")
      .leftJoinAndSelect("business.store", "store")
      .leftJoinAndSelect("user.orders", "orders")
      .leftJoinAndSelect("orders.items", "items")
      .leftJoinAndSelect("user.subscriptions", "subscriptions")

    if (role) {
      query.andWhere("user.role = :role", { role })
    }

    if (status) {
      query.andWhere("user.status = :status", { status })
    }

    if (search) {
      query.andWhere("LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search OR LOWER(user.email) LIKE :search", {
        search: `%${search.toLowerCase()}%`
      })
    }

    return await query
      .take(limit)
      .skip(page && page > 0 ? (page - 1) * limit : 0)
      .getManyAndCount()
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: this.relations
    })
  }

  private normalizeEmailFilter(filter: FindOptionsWhere<User>): FindOptionsWhere<User> {
    const normalizedFilter = { ...filter }

    if (typeof normalizedFilter.email === "string") {
      normalizedFilter.email = normalizedFilter.email.trim().toLowerCase()
    }

    return normalizedFilter
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User> {
    const normalizedFilter = this.normalizeEmailFilter(filter)

    const user = await this.userRepository.findOne({
      where: normalizedFilter,
      relations: this.relations
    })

    return user
  }

  exists(filter: FindOptionsWhere<User>): Promise<boolean> {
    const normalizedFilter = this.normalizeEmailFilter(filter)
    return this.userRepository.exists({ where: normalizedFilter })
  }

  async update(entity: User, data: UpdateUserDto, manager?: EntityManager): Promise<User> {
    const repo = manager ? manager.getRepository<User>(User) : this.userRepository
    const merged = repo.merge(entity, data)
    return repo.save(merged)
  }

  async remove(filter: FindOptionsWhere<User>): Promise<number> {
    const user = await this.userRepository.findOne({ where: filter })

    if (!user) return 0

    await this.userRepository.update(
      { id: user.id },
      {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        isEmailVerified: false,
        isPhoneNumberVerified: false,
        address: ""
      }
    )

    return 1
  }

  async headersRecords(query: IUserQuery, users: User[]): Promise<HeadersRecordsInterface> {
    const role = query.role

    if (role === UserRoleEnum.Customer) {
      const headers = [
        { key: "name", header: "Name" },
        { key: "phoneNumber", header: "Phone Number" },
        { key: "emailAddress", header: "Email Address" },
        { key: "orders", header: "Orders" },
        { key: "status", header: "Status" }
      ]

      const records = users.map((user) => {
        return {
          name: user.getFullName(),
          phoneNumber: user.phoneNumber,
          emailAddress: user.email,
          orders: user.ordersCount,
          status: user.status
        }
      })

      return { headers, records }
    } else if (role === UserRoleEnum.Vendor) {
      const headers = [
        { key: "name", header: "Name" },
        { key: "phoneNumber", header: "Phone Number" },
        { key: "emailAddress", header: "Email Address" },
        { key: "kycStatus", header: "Kyc Status" },
        { key: "orders", header: "Orders" },
        { key: "status", header: "Status" }
      ]

      const records = users.map((user) => {
        return {
          name: user.getFullName(),
          phoneNumber: user.phoneNumber,
          emailAddress: user.email,
          orders: user.itemsCount,
          kycStatus: user.business.kycStatus,
          status: user.status
        }
      })

      return { headers, records }
    } else {
      const headers = [
        { key: "name", header: "Name" },
        { key: "phoneNumber", header: "Phone Number" },
        { key: "emailAddress", header: "Email Address" },
        { key: "status", header: "Status" }
      ]

      const records = users.map((user) => {
        return {
          name: user.getFullName(),
          phoneNumber: user.phoneNumber,
          emailAddress: user.email,
          status: user.status
        }
      })

      return { records, headers }
    }
  }
}
