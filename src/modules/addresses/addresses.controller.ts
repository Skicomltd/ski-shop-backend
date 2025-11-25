import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, createAddressSchema } from './dto/create-address.dto';
import { UpdateAddressDto, updateAddressSchema } from './dto/update-address.dto';
import { NotFoundException } from '@/exceptions/notfound.exception';
import { JoiValidationPipe } from '@/validations/joi.validation';
import { Request } from 'express'
import { IAddressQuery } from './interface/query-filter.interface';
import { AddressResponseInterceptor } from './interceptor/address.interceptor';
import { AddressesResponseInterceptor } from './interceptor/addresses.interceptor';
import { PolicyAddressGuard } from './guard/policy-address.guard';
import { AppAbility } from '@/services/casl/casl-ability.factory';
import { Address } from './entities/address.entity';
import { Action } from '@/services/casl/actions/action';
import { CheckPolicies } from '../auth/decorators/policies-handler.decorator';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(PolicyAddressGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Address))
  @UseInterceptors(AddressResponseInterceptor)
  @Post()
  async create(@Body(new JoiValidationPipe(createAddressSchema)) createAddressDto: CreateAddressDto, @Req() req: Request) {
    const user = req.user
    createAddressDto.userId = user.id
    if (createAddressDto.default) {
       const updateDefaultAddressToInActive = await this.addressesService.findOne({userId: user.id, default: true})
      if (updateDefaultAddressToInActive) {
        await this.addressesService.update(updateDefaultAddressToInActive, { default: false })
      }
    }
    return this.addressesService.create(createAddressDto);
  }

  @UseGuards(PolicyAddressGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Address))
  @UseInterceptors(AddressesResponseInterceptor)
  @Get()
  findAll(@Query() query: IAddressQuery) {
    return this.addressesService.find(query);
  }

  @UseGuards(PolicyAddressGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Address))
  @UseInterceptors(AddressResponseInterceptor)
  @Get(':id')
  async findOne(@Param('id',  ParseUUIDPipe) id: string) {
    const address = await this.addressesService.findById(id);

    if (!address) {
      throw new NotFoundException("Address does not exist")
    }

    return address;
  }

  @UseGuards(PolicyAddressGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Address))
  @UseInterceptors(AddressResponseInterceptor)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateAddressSchema)) updateAddressDto: UpdateAddressDto) {
     const address = await this.addressesService.findById(id)
    if (!address) {
      throw new NotFoundException("Address does not exist")
    }
    if (updateAddressDto.default) {
      const updateDefaultAddressToInActive = await this.addressesService.findOne({userId: address.userId, default: true})
      if (updateDefaultAddressToInActive) {
        await this.addressesService.update(updateDefaultAddressToInActive, { default: true })
      }
    } 
    return this.addressesService.update(address, updateAddressDto);
  }

  @UseGuards(PolicyAddressGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Address))
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.addressesService.remove({ id });
  }
}
