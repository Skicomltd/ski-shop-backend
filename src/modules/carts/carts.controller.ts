import { Request } from "express"
import { Controller, Post, Body, Req, Get, Param, ParseUUIDPipe, Delete, Patch, UseInterceptors } from "@nestjs/common"
import { CartsService } from "./carts.service"
import { CreateCartDto, createCartSchema } from "./dto/create-cart.dto"
import { UpdateCartDto, updateCartSchema } from "./dto/update-cart.dto"
import { ProductsService } from "../products/products.service"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { ProductStatusEnum } from "../common/types"
import { CartInterceptor } from "./interceptors/cart.interceptor"
import { ConflictException } from "@/exceptions/conflict.exception"
import { CartsInterceptor } from "./interceptors/carts.interceptor"

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private productService: ProductsService
  ) {}

  @Post()
  @UseInterceptors(CartInterceptor)
  async create(@Body(new JoiValidationPipe(createCartSchema)) createCartDto: CreateCartDto, @Req() req: Request) {
    const user = req.user

    const product = await this.productService.findOne({ id: createCartDto.productId, status: ProductStatusEnum.published })
    if (!product) throw new NotFoundException("product not found")

    const exists = await this.cartsService.exists({ user: { id: user.id }, product: { id: product.id } })
    if (exists) throw new ConflictException("duplicate product in cart, increase quantity instead")

    return await this.cartsService.create({ user, product, quantity: createCartDto.quantity })
  }

  @Get()
  @UseInterceptors(CartsInterceptor)
  async findAll(@Req() req: Request) {
    const user = req.user
    return await this.cartsService.find({ user: { id: user.id } })
  }

  @Get("/:id")
  @UseInterceptors(CartInterceptor)
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const cart = await this.cartsService.findById(id)
    if (!cart) throw new NotFoundException(`cart not found`)
    return this.cartsService.findById(id)
  }

  @Patch(":id")
  @UseInterceptors(CartInterceptor)
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateCartSchema)) updateCartDto: UpdateCartDto) {
    const cart = await this.cartsService.findById(id)
    if (!cart) throw new NotFoundException(`cart not found`)
    return await this.cartsService.update(cart, updateCartDto)
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const count = await this.cartsService.remove({ id })
    if (count > 0) return "cart deleted successfully"
    return "Not deleted"
  }
}
