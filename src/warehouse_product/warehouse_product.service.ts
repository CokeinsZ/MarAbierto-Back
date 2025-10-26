import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  WarehouseProduct,
  WarehouseProductServiceInterface,
} from './interface/warehouse_product.interface';
import { WarehouseProductRepository } from 'src/databases/repositories/warehouse_product/warehouse_product.repository';
import {
  CreateWarehouseProductDto,
  UpdateProductQuantityDto,
} from './dto/warehouse_product.dto';

@Injectable()
export class WarehouseProductService
  implements WarehouseProductServiceInterface
{
  constructor(private readonly repo: WarehouseProductRepository) {}

  async addProductToWarehouse(
    dto: CreateWarehouseProductDto,
  ): Promise<WarehouseProduct> {
    // Optionally you could check for duplicates (same warehouse_id + product_id) before insert
    const created = await this.repo.create(dto);
    if (!created)
      throw new BadRequestException('Failed to add product to warehouse');
    return this.toInterface(created);
  }

  async getProductsInWarehouse(
    warehouse_id: number,
  ): Promise<WarehouseProduct[]> {
    const products = await this.repo.getProductsInWarehouse(warehouse_id);
    return products.map((p) => this.toInterface(p));
  }

  async updateProductQuantityInWarehouse(
    product_id: number,
    dto: UpdateProductQuantityDto,
  ): Promise<WarehouseProduct> {
    const existing = await this.repo.updateProductQuantityInWarehouse(
      product_id,
      dto,
    );
    if (!existing)
      throw new NotFoundException('Product in warehouse not found');
    return this.toInterface(existing);
  }

  async removeProductFromWarehouse(product_id: number): Promise<void> {
    // Optionally check exists
    await this.repo.removeProductFromWarehouse(product_id);
  }

  private toInterface(p: any): WarehouseProduct {
    return {
      warehouse_id: p.warehouse_id,
      product_id: p.product_id,
      quantity: p.quantity,
    };
  }
}
