import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { FishesService } from './fishes.service';
import { Public } from 'src/tools/decorators/public.decorator';
import { Roles } from 'src/tools/decorators/roles.decorator';
import {
  CreateFishDto,
  UpdateFishDto,
  FilterByDietDto,
  FilterByFishingSiteDto,
  FilterByHabitatDto,
  FilterBySizeDto,
  FilterByWeightDto,
} from './dtos/fish.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('fishes')
export class FishesController {
  constructor(private readonly fishesService: FishesService) {}

  // PUBLIC READ ENDPOINTS
  @Public()
  @Get()
  findAll() {
    return this.fishesService.findAll();
  }

  @Public()
  @Get('search')
  findByName(@Query('name') name: string) {
    return this.fishesService.findByName(name ?? '');
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fishesService.findById(id);
  }

  // FILTERS (public)
  @Public()
  @Get('filters/fishing-site')
  filterByFishingSite(@Query() dto: FilterByFishingSiteDto) {
    return this.fishesService.filterByFishingSite(dto);
  }

  @Public()
  @Get('filters/habitat')
  filterByHabitat(@Query() dto: FilterByHabitatDto) {
    return this.fishesService.filterByHabitat(dto);
  }

  @Public()
  @Get('filters/diet')
  filterByDiet(@Query() dto: FilterByDietDto) {
    return this.fishesService.filterByDiet(dto);
  }

  @Public()
  @Get('filters/size')
  filterBySize(@Query() dto: FilterBySizeDto) {
    return this.fishesService.filterBySize(dto);
  }

  @Public()
  @Get('filters/weight')
  filterByWeight(@Query() dto: FilterByWeightDto) {
    return this.fishesService.filterByWeight(dto);
  }

  // ADMIN / MANAGED ENDPOINTS
  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'Fish' })
  @Roles('admin')
  create(@Body() dto: CreateFishDto) {
    return this.fishesService.create(dto);
  }

  @Put(':id')
  @CheckPolicies({ action: Action.Update, subject: 'Fish' })
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFishDto) {
    return this.fishesService.update(id, dto);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: 'Fish' })
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fishesService.remove(id);
  }
}
