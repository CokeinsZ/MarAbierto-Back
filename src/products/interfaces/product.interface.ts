import {
  CreateProductDto,
  FindAllDto,
  UpdateProductDto,
} from '../dtos/product.dto';

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  created_at: Date;
  updated_at: Date;
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
