import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from 'src/tools/decorators/public.decorator';
import {
  CreateProductDto,
  FilterByCategoryDto,
  FilterByPriceRangeDto,
  FindAllDto,
  FindByNameDto,
  UpdateProductDto,
} from './dtos/product.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @CheckPolicies({ action: Action.Create, subject: 'Product' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Public()
  @Get()
  listProducts(@Body() dto: FindAllDto) {
    return this.productsService.listProducts(dto);
  }

  @Public()
  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productsService.getProductById(id);
  }

  @Public()
  @Get('filter/name')
  filterByName(@Query() dto: FindByNameDto) {
    return this.productsService.filterByName(dto.name);
  }

  @Public()
  @Get('filter/price-range')
  filterByPriceRange(@Query() dto: FilterByPriceRangeDto) {
    return this.productsService.filterByPriceRange(dto.min, dto.max);
  }

  @Public()
  @Get('filter/category')
  filterByCategory(@Query() dto: FilterByCategoryDto) {
    return this.productsService.filterByCategory(dto.category);
  }

  @CheckPolicies({ action: Action.Update, subject: 'Product' })
  @Patch(':id')
  updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @CheckPolicies({ action: Action.Delete, subject: 'Product' })
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
