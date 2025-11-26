import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { ProductPcategory } from '../../../product_pcategory/interfaces/product_pcategory.interface';
import { CreateProductPcategoryDto } from 'src/product_pcategory/dtos/product_pcategory.dto';
import { PCategory } from 'src/pcategories/interfaces/pcategory.interface';
import { Product } from 'src/products/interfaces/product.interface';

@Injectable()
export class ProductPcategoryRepository {
  constructor(private readonly db: DatabaseService) {}

  async createProductPcategory(
    dto: CreateProductPcategoryDto,
  ): Promise<ProductPcategory> {
    const result = await this.db.query<ProductPcategory>`
      INSERT INTO product_pcategory (product_id, pcategory_id)
      VALUES (${dto.product_id}, ${dto.pcategory_id})
      RETURNING *`;
    return result[0];
  }

  async findByProductId(id: string): Promise<PCategory[] | null> {
    const result = await this.db.query<PCategory>`
      SELECT c.* FROM pcategories c
      JOIN product_pcategory pc ON pc.pcategory_id = c.pcategory_id
      WHERE pc.product_id = ${id}`;
    return result || null;
  }

  async findByPcategoryId(id: string): Promise<{category: PCategory, products: Product[]} | null> {
    const categoryResult = await this.db.query<PCategory>`
      SELECT c.* FROM pcategories c
      WHERE c.pcategory_id = ${id}`;
    const productsResult = await this.db.query<Product>`
      SELECT p.* FROM products p
      JOIN product_pcategory pc ON pc.product_id = p.product_id
      WHERE pc.pcategory_id = ${id}`;
    if (!categoryResult || productsResult.length === 0) return null;
    return { category: categoryResult[0], products: productsResult };
  }

  async delete(product_id: string, pcategory_id: string): Promise<void> {
    await this.db.query`
      DELETE FROM product_pcategory 
      WHERE product_id = ${product_id} AND pcategory_id = ${pcategory_id}`;
  }
}
