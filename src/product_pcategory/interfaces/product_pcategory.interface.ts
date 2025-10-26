export interface ProductPcategory {
  product_id: string;
  pcategory_id: string;
}

export interface ProductPcategoryServiceInterface {
  create(data: ProductPcategory): Promise<ProductPcategory>;
  findByProductId(id: string): Promise<ProductPcategory | null>;
  findByPcategoryId(id: string): Promise<ProductPcategory | null>;
  delete(id: string): Promise<void>;
}
