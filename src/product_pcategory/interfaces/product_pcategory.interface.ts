import { PCategory } from "src/pcategories/interfaces/pcategory.interface";
import { Product } from "src/products/interfaces/product.interface";

export interface ProductPcategory {
  product_id: string;
  pcategory_id: string;
}

export interface ProductPcategoryServiceInterface {
  create(data: ProductPcategory): Promise<ProductPcategory>;
  findByProductId(id: string): Promise<PCategory[] | null>;
  findByPcategoryId(id: string): Promise<Product[] | null>;
  delete(id: string): Promise<void>;
}
