import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;
}

export class FindAllDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  max: number = 10;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;
}

export class UpdatePCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;
}
