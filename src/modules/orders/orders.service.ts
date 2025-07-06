import { Injectable } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { Order } from "./entities/order.entity"
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IOrdersQuery } from "./interfaces/query-filter.interface"

@Injectable()
export class OrdersService implements IService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async create(data: CreateOrderDto, manager?: EntityManager): Promise<Order> {
    const repo = manager ? manager.getRepository(Order) : this.orderRepository
    const order = repo.create(data)
    return await repo.save(order)
  }

  async find({ page, limit }: IOrdersQuery): Promise<[Order[], number]> {
    const where: FindManyOptions<Order>["where"] = {}

    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      take: limit,
      skip: page ? page - 1 : undefined
    })

    return [orders, count]
  }

  async findById(id: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Order>): Promise<Order> {
    return await this.orderRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Order>): Promise<boolean> {
    const count = await this.orderRepository.count({ where: filter })
    return count > 0
  }

  async update(entity: Order, data: UpdateOrderDto, manager?: EntityManager): Promise<Order> {
    const repo = manager ? manager.getRepository(Order) : this.orderRepository
    const updated = repo.merge(entity, data)
    return await repo.save(updated)
  }

  async remove(filter: FindOptionsWhere<Order>): Promise<number> {
    const result = await this.orderRepository.delete(filter)
    return result.affected ?? 0
  }
}
