import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, Query } from "@nestjs/common"
import { SubscriptionService } from "./subscription.service"
import { createSubcriptionSchema, CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { PlansService } from "../plans/plans.service"
import { Request } from "express"
import { PaymentsService } from "../services/payments/payments.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { SubscriptionsInterceptor } from "./interceptor/subscriptions.interceptor"
import { SubscriptionInterceptor } from "./interceptor/subscription.interceptor"
import { ISubscriptionsQuery } from "./interface/query-filter.interface"

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private plansService: PlansService,
    private paymentService: PaymentsService
  ) {}

  @Post()
  async create(@Body(new JoiValidationPipe(createSubcriptionSchema)) createSubscriptionDto: CreateSubscriptionDto, @Req() req: Request) {
    const user = req.user
    const plan = await this.plansService.findOne({ planCode: createSubscriptionDto.planCode })
    const planCode = plan ? plan.planCode : createSubscriptionDto.planCode
    const createSubscription = await this.paymentService.createSubscription({
      amount: createSubscriptionDto.amount,
      email: user.email,
      plan_code: planCode
    })

    createSubscriptionDto.vendorId = user.id
    createSubscriptionDto.reference = createSubscription.reference
    const { startDate, endDate } = await this.subscriptionService.getStartAndEndDate(createSubscriptionDto.planType.toLowerCase())
    createSubscriptionDto.startDate = startDate
    createSubscriptionDto.endDate = endDate
    const subscription = await this.subscriptionService.create(createSubscriptionDto)

    return {
      subscription,
      payment: createSubscription
    }
  }

  @UseInterceptors(SubscriptionsInterceptor)
  @Get()
  async findAll(@Query() query: ISubscriptionsQuery) {
    return await this.subscriptionService.find(query)
  }

  @UseInterceptors(SubscriptionInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.subscriptionService.findOne({ id: id })
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.subscriptionService.findOne({ id: id })
    if (!subscription) {
      throw new NotFoundException("Subscription does not exist")
    }
    return await this.subscriptionService.update(subscription, updateSubscriptionDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subscriptionService.remove({ id: id })
  }
}
