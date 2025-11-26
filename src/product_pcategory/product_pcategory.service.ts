import { Injectable } from '@nestjs/common';
import {
  ProductPcategory,
  ProductPcategoryServiceInterface,
} from './interfaces/product_pcategory.interface';
import { ProductPcategoryRepository } from 'src/databases/repositories/product_pcategory/product_pcategory.repository';
import { CreateProductPcategoryDto } from './dtos/product_pcategory.dto';
import { PCategory } from 'src/pcategories/interfaces/pcategory.interface';
import { Product } from 'src/products/interfaces/product.interface';

@Injectable()
export class ProductPcategoryService
  implements ProductPcategoryServiceInterface
{
  constructor(private readonly repository: ProductPcategoryRepository) {}

  async create(dto: CreateProductPcategoryDto): Promise<ProductPcategory> {
    return this.repository.createProductPcategory(dto);
  }

  async findByProductId(id: string): Promise<PCategory[] | null> {
    return this.repository.findByProductId(id);
  }

  async findByPcategoryId(id: string): Promise<{category: PCategory, products: Product[]} | null> {
    return this.repository.findByPcategoryId(id);
  }

  async delete(product_id: string, pcategory_id: string): Promise<void> {
    await this.repository.delete(product_id, pcategory_id);
  }
}
