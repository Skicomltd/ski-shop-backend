import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, Res, UseGuards, UseInterceptors } from "@nestjs/common"
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
import { Response } from "express"
import { CsvService } from "../services/utils/csv/csv.service"

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private csvService: CsvService
  ) {}

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(UserInterceptor)
  @Patch("/:id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateUserSchema)) updateUser: UpdateUserDto) {
    const user = await this.userService.findById(id)
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

  @Get("download")
  async download(@Query() query: IUserQuery, @Res() res: Response) {
    const [users] = await this.userService.find(query)
    const role = query.role
    // for now will ignore status, we not tracking status, we could use the isEmailVerified flag to confirm or add a new data type of status
    const headers = [
      { key: "name", header: "Name" },
      { key: "phoneNumber", header: "Phone Number" },
      { key: "emailAddress", header: "Email Address" },
      { key: "orders", header: "Orders" }
    ]

    const records = users.map((user) => {
      return {
        name: user.getFullName(),
        phoneNumber: user.phoneNumber,
        emailAddress: user.email,
        orders: role === UserRoleEnum.Customer ? user.ordersCount : user.itemsCount
      }
    })

    const data = await this.csvService.writeCsvToBuffer({ headers, records })

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=users.csv")
    res.send(data)
  }

  @UseGuards(PolicyUsersGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
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
