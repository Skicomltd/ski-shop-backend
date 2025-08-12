import { Injectable } from "@nestjs/common"
import { CreateCouponDto } from "./dto/create-coupon.dto"
import { UpdateCouponDto } from "./dto/update-coupon.dto"
import { Coupon } from "./entities/coupon.entity"
import { Between, EntityManager, Equal, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { ICouponsQuery } from "./interface/query-filter.interface"
import { CouponStats } from "./interface/coupon-stats.interface"

@Injectable()
export class CouponsService implements IService<Coupon> {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>
  ) {}

  async create(data: CreateCouponDto, manager?: EntityManager): Promise<Coupon> {
    const repo = manager ? manager.getRepository(Coupon) : this.couponRepository
    const coupon = repo.create(data)
    return await repo.save(coupon)
  }

  async find({ limit, page, startDate, endDate, couponType, quantity, remainingQuantity }: ICouponsQuery): Promise<[Coupon[], number]> {
    const where: FindOptionsWhere<Coupon> = {}
    if (startDate && endDate) {
      where.startDate = Between(startDate, endDate)
    }
    if (startDate) {
      where.startDate = MoreThanOrEqual(startDate)
    }

    if (endDate) {
      where.endDate = LessThanOrEqual(endDate)
    }

    if (couponType) {
      where.couponType = couponType
    }
    if (quantity) {
      where.quantity = Equal(quantity)
    }
    if (remainingQuantity) {
      where.remainingQuantity = Equal(remainingQuantity)
    }

    const [coupons, count] = await this.couponRepository.findAndCount({
      where: where,
      take: limit,
      skip: page ? (page - 1) * limit : undefined
    })
    return [coupons, count]
  }

  async findById(id: string): Promise<Coupon> {
    return await this.couponRepository.findOne({ where: { id } as FindOptionsWhere<Coupon> })
  }

  async findOne(filter: FindOptionsWhere<Coupon>): Promise<Coupon> {
    return await this.couponRepository.findOne({ where: filter })
  }

  async exists(filter: FindOptionsWhere<Coupon>): Promise<boolean> {
    const count = await this.couponRepository.count({ where: filter })
    return count > 0
  }

  async update(entity: Coupon, data: UpdateCouponDto, manager?: EntityManager): Promise<Coupon> {
    const repo = manager ? manager.getRepository(Coupon) : this.couponRepository
    const updated = repo.merge(entity, data)
    return await repo.save(updated)
  }

  async remove(filter: FindOptionsWhere<Coupon>): Promise<number> {
    const result = await this.couponRepository.delete(filter)
    return result.affected || 0
  }

  async couponStats(): Promise<CouponStats> {
    const query = await this.couponRepository
      .createQueryBuilder("coupon")
      .select("COUNT(coupon.id)", "count")
      .addSelect("SUM(coupon.quantity)", "totalQuantity")
      .addSelect("SUM(coupon.remainingQuantity)", "totalRemainingQuantity")
      .getRawOne()

    return {
      totalCoupons: parseInt(query.totalCoupons) || 0,
      totalQuantity: parseInt(query.totalQuantity) || 0,
      totalRemainingQuantity: parseInt(query.totalRemainingQuantity) || 0
    }
  }
}
