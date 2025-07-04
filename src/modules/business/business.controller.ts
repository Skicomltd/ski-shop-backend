import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from "@nestjs/common"
import { BusinessService } from "./business.service"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { CreateBusinessDto, createBusinessSchema } from "./dto/create-business-dto"
import { Request } from "express"
import { IBusinessQuery } from "./interface/businesses-query.interface"
import { UpdateBusinessDto, updateBusinessSchema } from "./dto/update-business-dto"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { PoliciesHasBusinessGuard } from "../auth/guard/policy-has-business.guard"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Action } from "../services/casl/actions/action"
import { User } from "../users/entity/user.entity"

@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post("/")
  async create(@Body(new JoiValidationPipe(createBusinessSchema)) createBusiness: CreateBusinessDto, @Req() req: Request) {
    const user = req.user

    createBusiness.user = user

    return await this.businessService.create(createBusiness)
  }

  @Get("/")
  async findAll(@Query() query: IBusinessQuery) {
    return await this.businessService.find(query)
  }

  @UseGuards(PoliciesHasBusinessGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @Get("/user")
  async findUserBusiness(@Req() req: Request) {
    const user = req.user

    const business = await this.businessService.findOne({ user: { id: user.id } })

    return business
  }

  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const business = await this.businessService.findOne({ id })

    if (!business) throw new NotFoundException("Business does not exist")

    return business
  }

  @Patch("/:id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateBusinessSchema)) updateBusiness: UpdateBusinessDto) {
    const business = await this.businessService.findOne({ id })

    if (!business) throw new NotFoundException("Business does not exist")

    return await this.businessService.update(business, updateBusiness)
  }

  @Delete("/:id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.businessService.remove({ id })
  }
}
