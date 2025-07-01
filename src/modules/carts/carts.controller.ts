import { Controller, Post, Body, Req, Get, Param, ParseUUIDPipe, Delete, Query, Patch } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CreateCartDto, createCartSchema } from "./dto/create-cart.dto"
import { UpdateCartDto, updateCartSchema } from "./dto/update-cart.dto"
import { Request } from "express"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { CreateCartItemsDto } from "./dto/create-cartItems.dto"
import { ProductsService } from "../products/products.service"
import { CartItemsService } from "./cartItems.service"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { IcartQuery } from "./interface/cart.interface"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { UpdateCartItemsDto } from "./dto/update-cartItem.dto"

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
    // const user = req.user
    // return this.transactionHelper.runInTransaction(async (manager) => {
    //   let cart = await this.cartsService.findOne({ user: { id: user.id } })
    //   const productSlugs = createCartDto.product.map((item) => item.slug)
    //   const [products] = await this.productService.find({})
    //   if (!cart) {
    //     cart = await this.cartsService.create({ ...createCartDto, user }, manager)
    //   }
    //   const productMap = new Map(products.map((p) => [p.slug, p]))
    //   for (const item of createCartDto.product) {
    //     const product = productMap.get(item.slug)
    //     if (!product) {
    //       throw new NotFoundException(`Product ${item.slug} not found`)
    //     }
    //     if (!item.quantity || item.quantity <= 0) {
    //       throw new BadReqException(`Invalid quantity for product ${item.slug}`)
    //     }
    //     if (product.stockCount < item.quantity) {
    //       throw new BadReqException(`Product ${item.slug} is not available or out of stock`)
    //     }
    //     const cartItems: CreateCartItemsDto = {
    //       product,
    //       quantity: item.quantity,
    //       cart
    //     }
    //     await this.cartItemsService.create(cartItems, manager)
    //   }
    //   return cart
    // })
  }

  @Get()
  findAll(@Query() query: IcartQuery, @Req() req: Request) {
    const user = req.user
    query.userId = user.id
    return this.cartsService.find(query)
  }

  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.cartsService.findOne({ id })
  }

  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateCartSchema)) updateCartDto: UpdateCartDto) {
    // const cart = await this.cartsService.findOne({ id })
    // if (!cart) {
    //   throw new NotFoundException(`Cart with ID ${id} not found`)
    // }
    // return this.transactionHelper.runInTransaction(async (manager) => {
    //   const productSlugs = updateCartDto.product.map((item) => item.slug)
    //   const [products] = await this.productService.find({ slug: productSlugs })
    //   const productMap = new Map(products.map((p) => [p.slug, p]))
    //   const [existingCartItems] = await this.cartItemsService.find({ cart: { id: cart.id } })
    //   for (const item of updateCartDto.product) {
    //     const product = productMap.get(item.slug)
    //     if (!product) {
    //       throw new NotFoundException(`Product ${item.slug} not found`)
    //     }
    //     if (!item.quantity || item.quantity <= 0) {
    //       throw new BadReqException(`Invalid quantity for product ${item.slug}`)
    //     }
    //     if (product.stockCount < item.quantity) {
    //       throw new BadReqException(`Product ${item.slug} is not available or out of stock`)
    //     }
    //     const existingItem = existingCartItems.find((cartItem) => cartItem.product.slug === item.slug)
    //     if (existingItem) {
    //       const cartItems: UpdateCartItemsDto = {
    //         product: existingItem.product,
    //         quantity: item.quantity ?? existingItem.quantity,
    //         cart
    //       }
    //       // Update existing cart item
    //       await this.cartItemsService.update(existingItem, cartItems, manager)
    //     } else {
    //       // Create new cart item
    //       const cartItems: CreateCartItemsDto = {
    //         product,
    //         quantity: item.quantity,
    //         cart
    //       }
    //       await this.cartItemsService.create(cartItems, manager)
    //     }
    //   }
    //   await this.cartsService.update(cart, updateCartDto, manager)
    //   // Fetch updated cart with items
    //   const updatedCart = await this.cartsService.findOne({ id })
    //   return updatedCart
    // })
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.cartsService.remove({ id })
  }

  @Delete("/cartitem/:cartItemId")
  async removeCartItem(@Param("cartItemId", ParseUUIDPipe) cartItemId: string) {
    return await this.cartItemsService.remove({ id: cartItemId })
  }
}
