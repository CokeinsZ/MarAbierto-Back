import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { WarehouseProduct } from '../../../warehouse_product/interface/warehouse_product.interface';
import {
  CreateWarehouseProductDto,
  UpdateProductQuantityDto,
} from 'src/warehouse_product/dto/warehouse_product.dto';

@Injectable()
export class WarehouseProductRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateWarehouseProductDto): Promise<WarehouseProduct> {
    const warehouseProduct = await this.db.query<WarehouseProduct>`
      INSERT INTO warehouse_product (warehouse_id, product_id, quantity)
      VALUES (${dto.warehouse_id}, ${dto.product_id}, ${dto.quantity})
      RETURNING *`;
    return warehouseProduct[0];
  }

  async getProductsInWarehouse(
    warehouse_id: number,
  ): Promise<WarehouseProduct[]> {
    const products = await this.db.query<WarehouseProduct>`
      SELECT * FROM warehouse_product WHERE warehouse_id = ${warehouse_id}`;
    return products;
  }

  async updateProductQuantityInWarehouse(
    product_id: number,
    dto: UpdateProductQuantityDto,
  ): Promise<WarehouseProduct> {
    const updatedProduct = await this.db.query<WarehouseProduct>`
      UPDATE warehouse_product
      SET quantity = ${dto.quantity}
      WHERE product_id = ${product_id}
      RETURNING *`;
    return updatedProduct[0];
  }

  async removeProductFromWarehouse(product_id: number): Promise<void> {
    await this.db.query`
      DELETE FROM warehouse_product WHERE product_id = ${product_id}`;
  }
}
