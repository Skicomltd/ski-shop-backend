import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto, createUserSchema } from "./dto/create-user-dto"
import { UpdateUserDto, updateUserSchema } from "./dto/update-user-dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { IUserQuery } from "./interfaces/users-query.interface"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("")
  async create(@Body(new JoiValidationPipe(createUserSchema)) createUser: CreateUserDto) {
    return await this.userService.create(createUser)
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

  @Get()
  async findAll(@Query() query: IUserQuery) {
    return await this.userService.find(query)
  }

  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.findOne({ id })
  }

  @Delete("/:id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.remove({ id })
  }
}
