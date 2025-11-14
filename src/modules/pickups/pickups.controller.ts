import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { CreatePickupDto, createPickupSchema } from './dto/create-pickup.dto';
import { UpdatePickupDto, updatePickupSchema } from './dto/update-pickup.dto';
import { NotFoundException } from '@/exceptions/notfound.exception';
import { JoiValidationPipe } from '@/validations/joi.validation';
import { PickupResponseInterceptor } from './interceptor/pickup.interceptor';
import { PickupsResponseInterceptor } from './interceptor/pickups.interceptor';
import { Public } from '../auth/decorators/public.decorator';
import { PolicyPickupGuard } from './guard/poliy-pickup.guard';
import { CheckPolicies } from '../auth/decorators/policies-handler.decorator';
import { AppAbility } from '@/services/casl/casl-ability.factory';
import { Action } from '@/services/casl/actions/action';
import { Pickup } from './entities/pickup.entity';


@Controller('pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}


  @UseGuards(PolicyPickupGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Pickup))
  @UseInterceptors(PickupResponseInterceptor)
  @Post()
  create(@Body(new JoiValidationPipe(createPickupSchema)) createLocationDto: CreatePickupDto) {
    return this.pickupsService.create(createLocationDto);
  }

  
  
  @UseGuards(PolicyPickupGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Pickup))
  @UseInterceptors(PickupsResponseInterceptor)
  @Get()
  findAll() {
    return this.pickupsService.find();
  }

  
  @UseGuards(PolicyPickupGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Pickup))
  @UseInterceptors(PickupResponseInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickupsService.findOne({id});
  }

  
  @UseGuards(PolicyPickupGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Pickup))
  @UseInterceptors(PickupResponseInterceptor)
  @Patch(':id')
  async update(@Param('id') id: string, @Body(new JoiValidationPipe(updatePickupSchema)) updatePickupDto: UpdatePickupDto) {
    const pickup = await this.pickupsService.findById(id)
    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }
    return this.pickupsService.update(pickup, updatePickupDto);
  }

  
  @UseGuards(PolicyPickupGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Pickup))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pickupsService.remove({id});
  }
}
