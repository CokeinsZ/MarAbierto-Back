import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Product,
  ProductServiceInterface,
} from './interfaces/product.interface';
import { ProductsRepository } from 'src/databases/repositories/products/products.repository';
import {
  CreateProductDto,
  FindAllDto,
  UpdateProductDto,
} from './dtos/product.dto';

@Injectable()
export class ProductsService implements ProductServiceInterface {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productsRepository.findByName(dto.name);
    existing.forEach((product) => {
      if (product.name.toLowerCase() === dto.name.toLowerCase()) {
        throw new ConflictException('Product with this name already exists');
      }
    });

    const created = await this.productsRepository.create(dto);
    if (!created) throw new Error('Product creation failed');
    return this.toProductInterface(created);
  }

  async listProducts(dto: FindAllDto): Promise<Product[]> {
    const products = await this.productsRepository.findAll(
      dto.max,
      (dto.page - 1) * dto.max,
    );
    return products.map(this.toProductInterface);
  }

  async getProductById(product_id: number): Promise<Product> {
    const product = await this.productsRepository.findById(product_id);
    if (!product) throw new NotFoundException('Product not found');
    return this.toProductInterface(product);
  }

  async filterByName(name: string): Promise<Product[]> {
    const products = await this.productsRepository.findByName(name);
    return products.map(this.toProductInterface);
  }

  async filterByPriceRange(min: number, max: number): Promise<Product[]> {
    const products = await this.productsRepository.filterByPriceRange(min, max);
    return products.map(this.toProductInterface);
  }

  async filterByCategory(category: string): Promise<Product[]> {
    const products = await this.productsRepository.filterByCategory(category);
    return products.map(this.toProductInterface);
  }

  async updateProduct(
    product_id: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findById(product_id);
    if (!product) throw new NotFoundException('Product not found');

    const updated = await this.productsRepository.update(product_id, dto);
    if (!updated) throw new Error('Product update failed');
    return this.toProductInterface(updated);
  }

  async deleteProduct(product_id: number): Promise<void> {
    const product = await this.productsRepository.findById(product_id);
    if (!product) throw new NotFoundException('Product not found');

    await this.productsRepository.delete(product_id);
  }

  private toProductInterface(product: any): Product {
    return {
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      img: product.img,
      created_at: product.created_at,
      updated_at: product.updated_at,
      categories: product.categories || [],
      warehouses: product.warehouses || [],
    };
  }
}
