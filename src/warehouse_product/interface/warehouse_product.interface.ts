import {
  CreateWarehouseProductDto,
  UpdateProductQuantityDto,
} from '../dto/warehouse_product.dto';

export interface WarehouseProduct {
  warehouse_id: number;
  product_id: number;
  quantity: number;
}

export interface WarehouseProductServiceInterface {
  addProductToWarehouse(
    dto: CreateWarehouseProductDto,
  ): Promise<WarehouseProduct>;
  getProductsInWarehouse(warehouse_id: number): Promise<WarehouseProduct[]>;
  updateProductQuantityInWarehouse(
    product_id: number,
    dto: UpdateProductQuantityDto,
  ): Promise<WarehouseProduct>;
  removeProductFromWarehouse(product_id: number): Promise<void>;
}
