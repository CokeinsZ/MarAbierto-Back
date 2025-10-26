import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { ProductPcategory } from '../../../product_pcategory/interfaces/product_pcategory.interface';
import { CreateProductPcategoryDto } from 'src/product_pcategory/dtos/product_pcategory.dto';

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

  async findByProductId(id: string): Promise<ProductPcategory | null> {
    const result = await this.db.query<ProductPcategory>`
      SELECT * FROM product_pcategory WHERE product_id = ${id}`;
    return result[0] || null;
  }

  async findByPcategoryId(id: string): Promise<ProductPcategory | null> {
    const result = await this.db.query<ProductPcategory>`
      SELECT * FROM product_pcategory WHERE pcategory_id = ${id}`;
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await this.db.query`
      DELETE FROM product_pcategory WHERE id = ${id}`;
  }
}
