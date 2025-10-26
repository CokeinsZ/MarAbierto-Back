import { Injectable } from '@nestjs/common';
import {
  ProductPcategory,
  ProductPcategoryServiceInterface,
} from './interfaces/product_pcategory.interface';
import { ProductPcategoryRepository } from 'src/databases/repositories/product_pcategory/product_pcategory.repository';
import { CreateProductPcategoryDto } from './dtos/product_pcategory.dto';

@Injectable()
export class ProductPcategoryService
  implements ProductPcategoryServiceInterface
{
  constructor(private readonly repository: ProductPcategoryRepository) {}

  async create(dto: CreateProductPcategoryDto): Promise<ProductPcategory> {
    return this.repository.createProductPcategory(dto);
  }

  async findByProductId(id: string): Promise<ProductPcategory | null> {
    return this.repository.findByProductId(id);
  }

  async findByPcategoryId(id: string): Promise<ProductPcategory | null> {
    return this.repository.findByPcategoryId(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
