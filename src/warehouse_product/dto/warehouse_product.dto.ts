import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWarehouseProductDto {
  @IsNotEmpty()
  @IsNumber()
  warehouse_id: number;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateProductQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
