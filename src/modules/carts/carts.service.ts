import { Injectable } from "@nestjs/common"
import { UpdateCartDto } from "./dto/update-cart.dto"
import { Cart } from "./entities/cart.entity"
import { EntityManager, FindManyOptions, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IcartQuery } from "./interfaces/cart.interface"
import { CommisionEnum } from "../commisions/enum/commision-enum"
import { SettingsService } from "../settings/settings.service"
import { CommisionsService } from "../commisions/commisions.service"

@Injectable()
export class CartsService implements IService<Cart> {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    private readonly settingService: SettingsService,
    private readonly commisionService: CommisionsService
  ) {}

  private readonly relations = ["product", "product.store", "product.store.business", "product.store.business.user"]

  async create(data: Partial<Cart>, manager?: EntityManager): Promise<Cart> {
    const repo = manager ? manager.getRepository(Cart) : this.cartRepository
    const cart = repo.create(data)
    return await repo.save(cart)
  }

  async find({ limit = 10, page = 1, ...query }: IcartQuery): Promise<[Cart[], number]> {
    const where: FindManyOptions<Cart>["where"] = { ...query }

    return await this.cartRepository.findAndCount({
      where,
      take: limit,
      skip: page ? page - 1 : undefined,
      relations: this.relations
    })
  }

  async findById(id: string): Promise<Cart> {
    return await this.cartRepository.findOne({ where: { id }, relations: this.relations })
  }

  async findOne(filter: FindOptionsWhere<Cart>): Promise<Cart> {
    return await this.cartRepository.findOne({ where: filter, relations: this.relations })
  }

  async exists(filter: FindOptionsWhere<Cart>): Promise<boolean> {
    return await this.cartRepository.exists({ where: filter, relations: this.relations })
  }

  async update(cart: Cart, data: UpdateCartDto, manager?: EntityManager): Promise<Cart> {
    const repo = manager ? manager.getRepository<Cart>(Cart) : this.cartRepository
    const updateCart = repo.create({ ...cart, ...data })
    return await repo.save(updateCart)
  }

  async remove(filter: FindOptionsWhere<Cart>, manager?: EntityManager): Promise<number> {
    const repo = manager ? manager.getRepository<Cart>(Cart) : this.cartRepository
    const cart = await repo.delete(filter)
    return cart.affected
  }

  async calculateTotalPrice(userId: string): Promise<number> {
    const result = await this.cartRepository
      .createQueryBuilder("cart")
      .innerJoin("cart.product", "product")
      .select(
        `
      SUM(
        cart.quantity *
        CASE
          WHEN product."discountPrice" IS NOT NULL AND product."discountPrice" > 0
          THEN product."discountPrice"
          ELSE product.price
        END
      )`,
        "total"
      )
      .where("cart.userId = :userId", { userId })
      .getRawOne()

    return parseFloat(result.total) || 0
  }

  async createCommissions(orderId: string, carts: Cart[], manager: EntityManager) {
    const storeIds = [...new Set(carts.map((cart) => cart.product.storeId))]
    const commissions = await Promise.all(
      storeIds.map(async (storeId) => {
        const storeSubtotal = carts
          .filter((cart) => cart.product.storeId === storeId)
          .reduce((sum, cart) => sum + cart.quantity * (cart.product.discountPrice || cart.product.price), 0)
        const { percentageAmount, fulfillmentFeePercentage } = await this.settingService.addFulfilmentFeeToOrderAmount(storeSubtotal)
        return this.commisionService.create(
          {
            storeId,
            commisionFee: percentageAmount,
            commisionValue: fulfillmentFeePercentage,
            orderId,
            commisionStatus: CommisionEnum.UNPAID
          },
          manager
        )
      })
    )
    return {
      commissions,
      totalCommissionFee: commissions.reduce((sum, comm) => sum + comm.commisionFee, 0)
    }
  }
}
