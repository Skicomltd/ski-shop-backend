import { Injectable } from "@nestjs/common"
import { OrderItem } from "./entities/order-item.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm"
import { IOrderItemQuery } from "./interfaces/orderItem-query"

import { OrderStatus } from "@/services/fez"
import { OrderDeliveryStatus } from "./interfaces/delivery-status"

@Injectable()
export class OrderItemService implements IService<OrderItem> {
  constructor(@InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>) {}

  async create(data: Partial<OrderItem>, manager?: EntityManager): Promise<OrderItem> {
    const repo = manager ? manager.getRepository(OrderItem) : this.orderItemRepository
    const order = repo.create(data)
    return await repo.save(order)
  }

  async find({ take, orderStatus }: IOrderItemQuery): Promise<[OrderItem[], number]> {
    const where: FindManyOptions<OrderItem>["where"] = {}
    if (orderStatus) {
      where.order = {
        status: orderStatus
      }
    }
    const [orderItem, count] = await this.orderItemRepository.findAndCount({
      where,
      order: { productId: "DESC" },
      take: take,
      relations: ["order", "order.product"]
    })
    return [orderItem, count]
  }

  async findById(id: string): Promise<OrderItem> {
    return await this.orderItemRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<OrderItem>): Promise<OrderItem> {
    const order = await this.orderItemRepository.findOne({ where: filter })
    return order
  }

  async exists(filter: FindOptionsWhere<OrderItem>): Promise<boolean> {
    const count = await this.orderItemRepository.count({ where: filter })
    return count > 0
  }

  async update(entity: OrderItem, data: Partial<OrderItem>, manager?: EntityManager): Promise<OrderItem> {
    const repo = manager ? manager.getRepository(OrderItem) : this.orderItemRepository
    const updated = repo.merge(entity, data)
    return await repo.save(updated)
  }

  async remove(filter: FindOptionsWhere<OrderItem>): Promise<number> {
    const result = await this.orderItemRepository.delete(filter)
    return result.affected ?? 0
  }

  async totalSales(vendorId: string): Promise<number> {
    const result = await this.orderItemRepository
      .createQueryBuilder("item")
      .innerJoin("item.product", "product")
      .where("product.userId = :vendorId", { vendorId })
      .select("SUM(item.unitPrice * item.quantity)", "total")
      .getRawOne()

    return Number(result.total) || 0
  }

  mapFezStatus(status: OrderStatus): OrderDeliveryStatus {
    switch (status) {
      case "Pending Pick-Up":
        return "pending"

      case "Assigned To A Rider":
        return "assigned"

      case "Picked-Up":
        return "picked_up"

      case "Enroute To Last Mile Hub":
        return "in_transit"

      case "Accepted At Last Mile Hub":
        return "arrived_at_hub"

      case "Dispatched":
        return "out_for_delivery"

      case "Delivered":
        return "delivered"
    }
  }
}
