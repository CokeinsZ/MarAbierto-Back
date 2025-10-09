import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFishDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(32)
    common_name: string;

    @IsOptional()
    @IsString()
    @MaxLength(128)
    scientific_name?: string;

    @IsNotEmpty()
    @IsString()
    habitat: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    mean_size?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    mean_weight?: number;

    @IsNotEmpty()
    @IsString()
    diet: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    img?: string;
}

export class UpdateFishDto {
    @IsOptional()
    @IsString()
    @MaxLength(32)
    common_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(128)
    scientific_name?: string;

    @IsOptional()
    @IsString()
    habitat?: string;

    @IsOptional()
    @IsNumber()
    mean_size?: number;

    @IsOptional()
    @IsNumber()
    mean_weight?: number;

    @IsOptional()
    @IsString()
    diet?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    img?: string;
}

export class FilterByFishingSiteDto {
    @IsNotEmpty()
    @IsString()
    site: string;
}

export class FilterByHabitatDto {
    @IsNotEmpty()
    @IsString()
    habitat: string;
}

export class FilterByDietDto {
    @IsNotEmpty()
    @IsString()
    diet: string;
}

export class FilterBySizeDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000)
    @Type(() => Number)
    min_size: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000)
    @Type(() => Number)
    max_size: number;
}

export class FilterByWeightDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000)
    @Type(() => Number)
    min_weight: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000)
    @Type(() => Number)
    max_weight: number;
}
