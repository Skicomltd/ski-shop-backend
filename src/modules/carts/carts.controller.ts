import { Controller, Post, Body, Req, Get, Param, ParseUUIDPipe } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CreateCartDto, createCartSchema } from "./dto/create-cart.dto"
// import { UpdateCartDto } from "./dto/update-cart.dto"
import { Request } from "express"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { CreateCartItemsDto } from "./dto/create-cartItems.dto"
import { ProductsService } from "../products/products.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { CartItemsService } from "./cartItems.service"
import { JoiValidationPipe } from "@/validations/joi.validation"

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private productService: ProductsService,
    private cartItemsService: CartItemsService
  ) {}

  @Post()
  async create(@Body(new JoiValidationPipe(createCartSchema)) createCartDto: CreateCartDto, @Req() req: Request) {
    const user = req.user

    // check if user already has a cart
    const userCart = await this.cartsService.findOne({ user: { id: user.id } })

    if (userCart) throw new BadReqException("User already has a cart")

    createCartDto.user = user

    const cart = await this.cartsService.create(createCartDto)

    // search for product
    const product = await this.productService.findOne({ slug: createCartDto.slug })

    if (!product) {
      throw new NotFoundException("Product not found")
    }

    // add the cart items

    const cartItems: CreateCartItemsDto = {
      cart,
      quantity: createCartDto.quantity,
      product
    }

    await this.cartItemsService.create(cartItems)
    return this.cartsService.findOne({ id: cart.id })
  }

  // @Get()
  // findAll() {
  //   return this.cartsService.find()
  // }

  @Get(":userId")
  findOne(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.cartsService.findOne({ user: { id: userId } })
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartsService.update(id, updateCartDto)
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.cartsService.remove(id)
  // }
}
