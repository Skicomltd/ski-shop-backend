import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrdersInterceptor } from "./interceptors/orders.interceptor"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { UpdateOrderDto, updateOrderSchema } from "./dto/update-order.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
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

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Order))
  @UseInterceptors(OrderInterceptor)
  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(updateOrderSchema)) updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersService.findOne({ id })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return this.ordersService.update(order, updateOrderDto)
  }

  @UseGuards(PolicyOrderGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Order))
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.ordersService.remove({ id })
  }
}
