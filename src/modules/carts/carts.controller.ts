import { Controller, Post, Body, Req, Get, Param, ParseUUIDPipe, Delete, Query } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CreateCartDto, createCartSchema } from "./dto/create-cart.dto"
// import { UpdateCartDto } from "./dto/update-cart.dto"
import { Request } from "express"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { CreateCartItemsDto } from "./dto/create-cartItems.dto"
import { ProductsService } from "../products/products.service"
import { CartItemsService } from "./cartItems.service"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { In } from "typeorm"
import { IcartQuery } from "./interface/cart.interface"
import { NotFoundException } from "@/exceptions/notfound.exception"

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private productService: ProductsService,
    private cartItemsService: CartItemsService,
    private transactionHelper: TransactionHelper
  ) {}

  @Post()
  async create(@Body(new JoiValidationPipe(createCartSchema)) createCartDto: CreateCartDto, @Req() req: Request) {
    const user = req.user

    // check if user already has a cart
    const userCart = await this.cartsService.findOne({ user: { id: user.id } })

    if (userCart) throw new BadReqException("User already has a cart")

    return this.transactionHelper.runInTransaction(async (manager) => {
      const productSlugs = createCartDto.product.map((item) => item.slug)
      const [products] = await this.productService.find({ slug: In(productSlugs) })

      const cart = await this.cartsService.create({ ...createCartDto, user }, manager)

      const productMap = new Map(products.map((p) => [p.slug, p]))

      createCartDto.product.map(async (item) => {
        const product = productMap.get(item.slug)
        if (!product) {
          throw new NotFoundException(`Product ${item.slug} not found`)
        } else if (!item.quantity || item.quantity <= 0) {
          throw new BadReqException(`Invalid quantity for product ${item.slug}`)
        } else if (product.stockCount < item.quantity) {
          throw new BadReqException(`Product ${item.slug} is not available or out of stock`)
        }
        const cartItems: CreateCartItemsDto = {
          product,
          quantity: item.quantity,
          cart
        }
        await this.cartItemsService.create(cartItems, manager)
      })
      return cart
    })
  }

  @Get()
  findAll(@Query() query: IcartQuery) {
    return this.cartsService.find(query)
  }

  @Get("user/:userId")
  async findOne(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.cartsService.findOne({ user: { id: userId } })
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartsService.update(id, updateCartDto)
  // }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.cartsService.remove({ id })
  }
}
