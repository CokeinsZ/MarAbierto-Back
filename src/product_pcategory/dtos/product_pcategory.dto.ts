import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductPcategoryDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  pcategory_id: string;
}
