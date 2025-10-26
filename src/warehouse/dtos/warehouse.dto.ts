import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { warehouseStatus } from '../interfaces/warehouse.interface';

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(warehouseStatus, {
    message:
      'status must be one of the following: active, inactive, under_maintenance, full',
  })
  status?: warehouseStatus;
}

export class ListWarehousesDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  max?: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;
}

export class GetWarehouseByNameDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;
}

export class GetWarehousesByCityDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  city: string;
}

export class GetWarehousesByStatusDto {
  @IsNotEmpty()
  @IsEnum(warehouseStatus, {
    message:
      'status must be one of the following: active, inactive, under_maintenance, full',
  })
  status: warehouseStatus;
}

export class UpdateWarehouseDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class ChangeWarehouseStatusDto {
  @IsNotEmpty()
  @IsEnum(warehouseStatus, {
    message:
      'status must be one of the following: active, inactive, under_maintenance, full',
  })
  status: warehouseStatus;
}
