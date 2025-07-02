import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JoiValidationPipe } from '@/validations/joi.validation';
import { CreateBusinessDto, createBusinessSchema } from './dto/create-business-dto';
import {Request} from "express"
import { IBusinessQuery } from './interface/businesses-query.interface';
import { UpdateBusinessDto, updateBusinessSchema } from './dto/update-business-dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post("")
  async create(@Body(new JoiValidationPipe(createBusinessSchema)) createBusiness: CreateBusinessDto, @Req() req: Request) {
    const user = req.user

    createBusiness.user = user

    return await this.businessService.create(createBusiness)
  }

  @Get("/")
  async findAll(@Query() query: IBusinessQuery) {
    return await this.businessService.find(query)
  }

  @Get("/:id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return await this.businessService.findOne({ id })
  }

  @Patch("/:id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateBusinessSchema)) updateBusiness: UpdateBusinessDto) {
    const business = await this.businessService.findOne({ id })
    return await this.businessService.update(business, updateBusiness)
  }

  @Delete("/:id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return await this.businessService.remove({ id })
  }
}
