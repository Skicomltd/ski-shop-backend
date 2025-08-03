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

  async find({ page, limit, buyerId, deliveryStatus, status, storeId, productId, sort = "desc" }: IOrdersQuery): Promise<[Order[], number]> {
    const where: FindManyOptions<Order>["where"] = {}

    if (buyerId) {
      where.buyerId = buyerId
    }

    if (deliveryStatus) {
      where.deliveryStatus = deliveryStatus
    }

    if (status) {
      where.status = status
    }

    if (storeId) {
      where.items = {
        storeId
      }
    }

    if (productId) {
      where.items = {
        productId
      }
    }

    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      order: { createdAt: sort },
      take: limit,
      skip: page ? page - 1 : undefined
    })

    // filter out products not from the store
    const filteredOrders = orders.map((order) => {
      const filteredItems = storeId ? order.items.filter((item) => item.storeId === storeId) : order.items

      return { ...order, items: filteredItems }
    })

    return [filteredOrders, count]
  }

  async findById(id: string): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Order> & { storeId?: string }): Promise<Order> {
    const { storeId, ...orderFilter } = filter

    const order = await this.orderRepository.findOne({
      where: orderFilter,
      relations: ["items"]
    })

    if (!order) return null

    const items = storeId ? order.items.filter((item) => item.storeId === storeId) : order.items

    return { ...order, items }
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

  async getMonthlySales() {
    return await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "item")
      .select("EXTRACT(MONTH FROM order.createdAt)::integer", "month")
      .addSelect("SUM(item.unitPrice * item.quantity)", "total")
      .where("order.status = :status", { status: "paid" })
      .andWhere("EXTRACT(YEAR FROM order.createdAt) = :year", { year: new Date().getFullYear() })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany()
  }

  async totalNumberOfOrder(filter: FindOptionsWhere<Order>) {
    return await this.orderRepository.count({
      where: filter
    })
  }
}
