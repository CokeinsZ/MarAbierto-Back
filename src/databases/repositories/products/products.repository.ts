import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { Product } from '../../../products/interfaces/product.interface';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const rows = await this.db.query<Product>`
      INSERT INTO products (name, description, price, img)
      VALUES (${dto.name}, ${dto.description}, ${dto.price}, ${dto.img})
      RETURNING *`;
    return rows[0];
  }

  async findAll(limit: number, page: number): Promise<Product[]> {
    const rows = await this.db.query<Product>`
      SELECT * FROM products
      LIMIT ${limit} OFFSET ${page}`;
    return rows;
  }

  async findById(product_id: number): Promise<Product | null> {
    const rows = await this.db.query<Product>`
      SELECT * FROM products WHERE product_id = ${product_id}`;
    return rows[0] || null;
  }

  async findByName(name: string): Promise<Product[]> {
    const rows = await this.db.query<Product>`
      SELECT * FROM products WHERE unaccent(name) ILIKE '%' || unaccent(${name}) || '%'`;
    return rows;
  }

  async filterByPriceRange(min: number, max: number): Promise<Product[]> {
    const rows = await this.db.query<Product>`
      SELECT * FROM products
      WHERE price BETWEEN ${min} AND ${max}`;
    return rows;
  }

  async filterByCategory(category: string): Promise<Product[]> {
    const rows = await this.db.query<Product>`
      SELECT p.* FROM products p
      JOIN pcategories pc ON pc.product_id = p.product_id
      JOIN product_pcategories ppc ON ppc.category_id = pc.category_id
      WHERE unaccent(pc.name) ILIKE '%' || unaccent(${category}) || '%'`;
    return rows;
  }

  async update(product_id: number, dto: UpdateProductDto): Promise<Product> {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      throw new BadRequestException(
        "No fields to update. (You can't update the id)",
      );
    }
    const setClauses: string[] = [];
    const values: any[] = [];
    keys.forEach((k, idx) => {
      setClauses.push(`${k} = $${idx + 1}`);
      values.push((dto as any)[k]);
    });
    // WHERE param position is next
    const whereIndex = values.length + 1;
    const sql = `UPDATE products SET ${setClauses.join(', ')} WHERE product_id = $${whereIndex} RETURNING *`;
    values.push(product_id);
    const rows = await this.db.unsafe<Product>(sql, values);
    return rows[0];
  }

  async delete(product_id: number): Promise<void> {
    await this.db.query`
      DELETE FROM products WHERE product_id = ${product_id}`;
  }
}
