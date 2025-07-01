import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from "@nestjs/common"
import { UserService } from "./user.service"
import { BusinessService } from "./business.service"
import { CreateUserDto, createUserSchema } from "./dto/create-user-dto"
import { UpdateUserDto, updateUserSchema } from "./dto/update-user-dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { IUserQuery } from "./interfaces/users-query.interface"
import { CreateBusinessDto, createBusinessSchema } from "./dto/create-business-dto"
import { Request } from "express"
import { UpdateBusinessDto, updateBusinessSchema } from "./dto/update-business-dto"
import { IBusinessQuery } from "./interfaces/businesses-query.interface"

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private bussinessService: BusinessService
  ) {}

  @Post("")
  async create(@Body(new JoiValidationPipe(createUserSchema)) createUser: CreateUserDto) {
    return await this.userService.create(createUser)
  }

  @Post("/business")
  async createBusiness(@Body(new JoiValidationPipe(createBusinessSchema)) createBusiness: CreateBusinessDto, @Req() req: Request) {
    const user = req.user

    createBusiness.user = user

    return await this.bussinessService.create(createBusiness)
  }

  @Patch("/:id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateUserSchema)) updateUser: UpdateUserDto) {
    const user = await this.userService.findOne({ id })
    if (!user) {
      throw new NotFoundException("User does not exist")
    }

    const prepareUserUpdate: UpdateUserDto = {
      email: updateUser.email ?? user.email,
      firstName: updateUser.firstName ?? user.firstName,
      lastName: updateUser.lastName ?? user.lastName,
      password: updateUser.password ?? user.password,
      role: updateUser.role ?? user.role
    }

    return await this.userService.update(user, prepareUserUpdate)
  }

  @Patch("/business/:id")
  async updateBusiness(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateBusinessSchema)) updateBusiness: UpdateBusinessDto) {
    const business = await this.bussinessService.findOne({ id })
    return await this.bussinessService.update(business, updateBusiness)
  }

  @Get()
  async findAll(@Query() query: IUserQuery) {
    return await this.userService.find(query)
  }

  @Get("/business")
  async findAllBusiness(@Query() query: IBusinessQuery) {
    return await this.bussinessService.find(query)
  }

  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.findOne({ id })
  }
  @Get("/business/:id")
  async findOneBusiness(@Param("id", ParseUUIDPipe) id: string) {
    return await this.bussinessService.findOne({ id })
  }

  @Delete("/:id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.remove({ id })
  }
  @Delete("/business/:id")
  async removeBusiness(@Param("id", ParseUUIDPipe) id: string) {
    return await this.bussinessService.remove({ id })
  }
}
