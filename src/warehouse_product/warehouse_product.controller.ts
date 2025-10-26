import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { WarehouseProductService } from './warehouse_product.service';
import {
  CreateWarehouseProductDto,
  UpdateProductQuantityDto,
} from './dto/warehouse_product.dto';
import { Public } from 'src/tools/decorators/public.decorator';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { Roles } from 'src/tools/decorators/roles.decorator';

@Controller('warehouse-product')
export class WarehouseProductController {
  constructor(private readonly service: WarehouseProductService) {}

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'WarehouseProduct' })
  @Roles('admin')
  add(@Body() dto: CreateWarehouseProductDto) {
    return this.service.addProductToWarehouse(dto);
  }

  @Public()
  @Get(':warehouse_id')
  list(@Param('warehouse_id') warehouse_id: string) {
    const id = Number(warehouse_id);
    return this.service.getProductsInWarehouse(id);
  }

  @Put(':product_id')
  @CheckPolicies({ action: Action.Update, subject: 'WarehouseProduct' })
  @Roles('admin')
  updateQuantity(
    @Param('product_id') product_id: string,
    @Body() dto: UpdateProductQuantityDto,
  ) {
    return this.service.updateProductQuantityInWarehouse(
      Number(product_id),
      dto,
    );
  }

  @Delete(':product_id')
  @CheckPolicies({ action: Action.Delete, subject: 'WarehouseProduct' })
  @Roles('admin')
  remove(@Param('product_id') product_id: string) {
    return this.service.removeProductFromWarehouse(Number(product_id));
  }
}
