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

export class CreateFishingSiteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  description: string;
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

export class FindByNameDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterByAddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateFishingSiteDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
