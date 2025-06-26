import { Injectable } from "@nestjs/common"
import { CreateCartDto } from "./dto/create-cart.dto"
import { UpdateCartDto } from "./dto/update-cart.dto"
import { Cart } from "./entities/cart.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IcartQuery } from "./interface/cart.interface"

@Injectable()
export class CartsService implements IService<Cart> {
  constructor(@InjectRepository(Cart) private cartRepository: Repository<Cart>) {}

  async create(data: CreateCartDto, manager?: EntityManager): Promise<Cart> {
    const repo = manager ? manager.getRepository(Cart) : this.cartRepository
    const createCart = repo.create({
      ...data
    })
    return await repo.save(createCart)
  }

  async find({ limit, page }: IcartQuery): Promise<[Cart[], number]> {
    return await this.cartRepository.findAndCount({
      take: limit,
      skip: page ? page - 1 : undefined
    })
  }

  async findById(id: string): Promise<Cart> {
    return await this.cartRepository.findOne({ where: { id } })
  }

  async findOne(filter: FindOptionsWhere<Cart>): Promise<Cart> {
    return await this.cartRepository.findOne({ where: filter, relations: ["cartItems", "cartItems.product", "user"] })
  }

  async exists(filter: FindOptionsWhere<Cart>): Promise<boolean> {
    return await this.cartRepository.exists({ where: filter })
  }

  async update(cart: Cart, data: UpdateCartDto, manager?: EntityManager): Promise<Cart> {
    const repo = manager ? manager.getRepository<Cart>(Cart) : this.cartRepository
    const updateCart = repo.create({ ...cart, ...data })
    return await repo.save(updateCart)
  }
  async remove(filter: FindOptionsWhere<Cart>): Promise<number> {
    const cart = await this.cartRepository.delete(filter)
    return cart.affected
  }
}
