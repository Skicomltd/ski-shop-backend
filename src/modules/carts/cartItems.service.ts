import { Injectable } from "@nestjs/common"
import { CartItems } from "./entities/cartItmes.entity"
import { EntityManager, FindOptionsWhere, Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { CreateCartItemsDto } from "./dto/create-cartItems.dto"
import { UpdateCartItemsDto } from "./dto/update-cartItem.dto"

@Injectable()
export class CartItemsService implements IService<CartItems> {
  constructor(@InjectRepository(CartItems) private cartItemsRepository: Repository<CartItems>) {}

  async create(data: CreateCartItemsDto, manager?: EntityManager): Promise<CartItems> {
    const repo = manager ? manager.getRepository(CartItems) : this.cartItemsRepository
    const cartItem = repo.create({
      ...data
    })

    return repo.save(cartItem)
  }

  async findById(id: string): Promise<CartItems> {
    return await this.cartItemsRepository.findOne({ where: { id: id } })
  }

  async findOne(filter: FindOptionsWhere<CartItems>): Promise<CartItems> {
    return await this.cartItemsRepository.findOne({ where: filter })
  }

  async find(): Promise<[CartItems[], number]> {
    return await this.cartItemsRepository.findAndCount()
  }

  async update(cartItem: CartItems, data: UpdateCartItemsDto, manager?: EntityManager): Promise<CartItems> {
    const repo = manager ? manager.getRepository(CartItems) : this.cartItemsRepository
    const updateCartItem = repo.create({ ...cartItem, ...data })
    return await repo.save(updateCartItem)
  }

  async exists(filter: FindOptionsWhere<CartItems>): Promise<boolean> {
    return await this.cartItemsRepository.exists({ where: filter })
  }

  async remove(filter: FindOptionsWhere<CartItems>): Promise<number> {
    const cartItem = await this.cartItemsRepository.delete(filter)
    return cartItem.affected
  }
}
