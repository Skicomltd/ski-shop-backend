import { Injectable } from "@nestjs/common"
import { CreateOrderDto } from "./dto/create-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { Order } from "./entities/order.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrderRevenueInterface } from "./interfaces/order-revenue.interface"
import { MonthlySalesData, MonthlySalesQuery } from "./interfaces/order-monthlystats.interface"
import { StoreOrderRevenueSummary } from "./interfaces/store-order.interface"

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

  async find({
    page = 1,
    limit = 10,
    buyerId,
    deliveryStatus,
    status,
    storeId,
    productId,
    orderBy = "ASC",
    startDate,
    endDate
  }: IOrdersQuery): Promise<[Order[], number]> {
    const query = this.orderRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.buyer", "buyer")
      .leftJoinAndSelect("order.items", "item")
      .leftJoinAndSelect("item.product", "product")
      .leftJoinAndSelect("product.user", "vendor")
      .orderBy("order.createdAt", orderBy)

    if (buyerId) {
      query.andWhere("order.buyerId = :buyerId", { buyerId })
    }

    if (deliveryStatus) {
      query.andWhere("order.deliveryStatus = :deliveryStatus", { deliveryStatus })
    }

    if (status) {
      query.andWhere("order.status = :status", { status })
    }

    if (storeId) {
      query.andWhere("item.storeId = :storeId", { storeId })
    }

    if (productId) {
      query.andWhere("item.productId = :productId", { productId })
    }

    if (startDate && endDate) {
      query.andWhere("order.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate
      })
    }

    if (startDate) {
      query.andWhere("order.createdAt >= :startDate", { startDate })
    }

    if (endDate) {
      query.andWhere("order.createdAt <= :endDate", { endDate })
    }

    query.skip((page - 1) * limit).take(limit)

    return await query.getManyAndCount()
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

  async getOrderMonthlyRevenue({}: MonthlySalesQuery): Promise<MonthlySalesData[]> {
    const result = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "item")
      .select("EXTRACT(YEAR FROM order.createdAt)::integer", "year")
      .addSelect("EXTRACT(MONTH FROM order.createdAt)::integer", "month")
      .addSelect("SUM(item.unitPrice * item.quantity)", "total")
      // .where("order.status = :status", { status })
      // .andWhere("order.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("year, month")
      .orderBy("year, month", "ASC")
      .getRawMany()

    return result.map((row) => ({
      year: row.year,
      month: row.month,
      total: parseFloat(row.total) || 0
    }))
  }

  async calculateOrdersTotalRevenue({ startDate, endDate, status }: OrderRevenueInterface): Promise<number> {
    const query = this.orderRepository.createQueryBuilder("order").leftJoinAndSelect("order.items", "item")

    if (startDate && endDate) {
      query.andWhere("order.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate
      })
    }

    if (startDate) {
      query.andWhere("order.createdAt >= :startDate", { startDate })
    }

    if (endDate) {
      query.andWhere("order.createdAt <= :endDate", { endDate })
    }

    if (status) {
      query.andWhere("order.status = :status", { status })
    }

    query.select("SUM(item.unitPrice * item.quantity)", "total")

    return (await query.getRawOne())?.total || 0
  }

  async getStoreRevenueMetrics(storeId: string): Promise<StoreOrderRevenueSummary> {
    const result = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.items", "item")
      .select("SUM(item.unitPrice * item.quantity)", "totalSales")
      .addSelect("COUNT(DISTINCT order.id)", "totalOrder")
      .addSelect("AVG(item.unitPrice * item.quantity)", "averageOrderValue")
      .where("order.status = :status AND item.storeId = :storeId", { status: "paid", storeId })
      .getRawOne()

    return {
      totalSales: parseFloat(result?.totalSales || 0),
      totalOrder: parseInt(result?.totalOrder || 0, 10),
      averageOrderValue: parseFloat(result?.averageOrderValue || 0)
    }
  }
}
