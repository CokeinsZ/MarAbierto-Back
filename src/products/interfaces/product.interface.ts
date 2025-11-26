import {
  CreateProductDto,
  FindAllDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { PCategory } from '../../pcategories/interfaces/pcategory.interface';
import { Warehouse } from '../../warehouse/interfaces/warehouse.interface';

export interface ProductWarehouse {
  warehouse: Warehouse;
  stock: number;
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  created_at: Date;
  updated_at: Date;
  categories?: PCategory[];
  warehouses?: ProductWarehouse[];
}

export interface ProductServiceInterface {
  createProduct(dto: CreateProductDto): Promise<Product>;
  listProducts(dto: FindAllDto): Promise<Product[]>;
  getProductById(product_id: number): Promise<Product>;
  filterByName(name: string): Promise<Product[]>;
  filterByPriceRange(min: number, max: number): Promise<Product[]>;
  filterByCategory(category: string): Promise<Product[]>;
  updateProduct(product_id: number, dto: UpdateProductDto): Promise<Product>;
  deleteProduct(product_id: number): Promise<void>;
}
