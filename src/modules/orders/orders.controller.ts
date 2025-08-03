import { Controller, Get, Param, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrdersInterceptor } from "./interceptors/orders.interceptor"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { OrderInterceptor } from "./interceptors/order.interceptor"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { PolicyOrderGuard } from "./guard/policy-order.guard"
import { Action } from "../services/casl/actions/action"
import { Order } from "./entities/order.entity"
import { Request } from "express"
import { Between, FindOptionsWhere } from "typeorm"
import { UserRoleEnum } from "../users/entity/user.entity"

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrdersInterceptor)
  @Get("/")
  findAll(@Query() query: IOrdersQuery, @Req() req: Request) {
    const user = req.user
    if (user.role === UserRoleEnum.Customer) {
      query.buyerId = user.id
    } else if (user.role === UserRoleEnum.Vendor) {
      query.storeId = user.business?.store?.id
    }
    return this.ordersService.find(query)
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrderInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const filter: FindOptionsWhere<Order> & { storeId?: string } = { id }

    if (req.user.role !== UserRoleEnum.Customer) {
      filter.storeId = req.user.business.store.id
    }

    const order = this.ordersService.findOne(filter)

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Order))
  @Get("/sales")
  async salesOverview() {
    return await this.ordersService.getMonthlySales()
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Order))
  @Get("/totalorder")
  async totalOrder(@Query() query: IOrdersQuery) {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    const targetMonth = query.month ?? currentMonth
    const targetYear = query.year ?? currentYear

    const startDate = new Date(targetYear, targetMonth - 1, 1)
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59)

    return await this.ordersService.totalNumberOfOrder({ status: "paid", createdAt: Between(startDate, endDate) })
  }
}
