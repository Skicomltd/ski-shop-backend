import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { UserService } from "./user.service"
import { UpdateUserDto, updateUserSchema } from "./dto/update-user-dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { IUserQuery } from "./interfaces/users-query.interface"
import { UserInterceptor } from "./interceptor/user.interceptor"
import { UsersInterceptor } from "./interceptor/users.interceptor"
import { User, UserRoleEnum } from "./entity/user.entity"
import { Action } from "../services/casl/actions/action"
import { PolicyUsersGuard } from "./guard/policy-user.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(UserInterceptor)
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

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @UseInterceptors(UsersInterceptor)
  @Get()
  async findAll(@Query() query: IUserQuery) {
    return await this.userService.find(query)
  }

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @Get("/total")
  async totalNumberOfUsersType() {
    const buyer = await this.userService.find({ role: UserRoleEnum.Customer })
    const vendor = await this.userService.find({ role: UserRoleEnum.Vendor })
    const rider = await this.userService.find({ role: UserRoleEnum.Rider })

    return {
      buyerCount: buyer[1],
      vendorCount: vendor[1],
      riderCount: rider[1]
    }
  }

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(UserInterceptor)
  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.findOne({ id })
  }

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, User))
  @Delete("/:id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.remove({ id })
  }
}
