import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Put,
  Patch,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Public } from 'src/tools/decorators/public.decorator';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import {
  CreateWarehouseDto,
  ListWarehousesDto,
  GetWarehouseByNameDto,
  GetWarehousesByCityDto,
  GetWarehousesByStatusDto,
  UpdateWarehouseDto,
  ChangeWarehouseStatusDto,
} from './dtos/warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Public()
  @Get()
  list(@Query() dto: ListWarehousesDto) {
    return this.warehouseService.listWarehouses(dto);
  }

  @Public()
  @Get('search')
  findByName(@Query() dto: GetWarehouseByNameDto) {
    return this.warehouseService.getWarehouseByName(dto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.getWarehouseById(id);
  }

  @Public()
  @Get('filters/city')
  findByCity(@Query() dto: GetWarehousesByCityDto) {
    return this.warehouseService.getWarehouseByCity(dto);
  }

  @Public()
  @Get('filters/status')
  findByStatus(@Query() dto: GetWarehousesByStatusDto) {
    return this.warehouseService.getWarehouseByStatus(dto);
  }

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'Warehouse' })
  @Roles('admin')
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.createWarehouse(dto);
  }

  @Put(':id')
  @CheckPolicies({ action: Action.Update, subject: 'Warehouse' })
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.updateWarehouse(id, dto);
  }

  @Patch(':id/status')
  @CheckPolicies({ action: Action.Update, subject: 'Warehouse' })
  @Roles('admin')
  changeStatus(@Param('id') id: string, @Body() dto: ChangeWarehouseStatusDto) {
    return this.warehouseService.changeWarehouseStatus(id, dto);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: 'Warehouse' })
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.warehouseService.deleteWarehouse(id);
  }
}
