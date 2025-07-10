import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrdersInterceptor } from "./interceptors/orders.interceptor"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { OrderInterceptor } from "./interceptors/order.interceptor"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { PolicyOrderGuard } from "../auth/guard/policy-order.guard"
import { Action } from "../services/casl/actions/action"
import { Order } from "./entities/order.entity"

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrdersInterceptor)
  @Get("/")
  findAll(@Query() query: IOrdersQuery) {
    return this.ordersService.find(query)
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Order))
  @UseInterceptors(OrderInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const order = this.ordersService.findOne({ id })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }
}
