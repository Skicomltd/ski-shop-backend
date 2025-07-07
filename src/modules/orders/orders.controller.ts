import { Controller, Get, Query, UseInterceptors } from "@nestjs/common"
import { OrdersService } from "./orders.service"
import { IOrdersQuery } from "./interfaces/query-filter.interface"
import { OrdersInterceptor } from "./interceptors/orders.interceptor"

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Post()
  // create(@Body() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.create(createOrderDto)
  // }

  @UseInterceptors(OrdersInterceptor)
  @Get("/")
  findAll(@Query() query: IOrdersQuery) {
    return this.ordersService.find(query)
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.ordersService.findOne(+id)
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto)
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.ordersService.remove(+id)
  // }
}
