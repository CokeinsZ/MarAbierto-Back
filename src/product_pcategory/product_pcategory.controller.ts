import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductPcategoryService } from './product_pcategory.service';
import { CreateProductPcategoryDto } from './dtos/product_pcategory.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { Public } from 'src/tools/decorators/public.decorator';

@Controller('product-pcategory')
export class ProductPcategoryController {
  constructor(private readonly service: ProductPcategoryService) {}

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'ProductPcategory' })
  async create(@Body() dto: CreateProductPcategoryDto) {
    const productPcategory = await this.service.create(dto);
    return {
      message: 'Product-Pcategory association created successfully.',
      productPcategory,
    };
  }

  @Public()
  @Get('by-product/:id')
  async findByProductId(@Param('id') id: string) {
    return this.service.findByProductId(id);
  }

  @Public()
  @Get('by-pcategory/:id')
  async findByPcategoryId(@Param('id') id: string) {
    return this.service.findByPcategoryId(id);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: 'ProductPcategory' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Product-Pcategory association deleted successfully.' };
  }
}
