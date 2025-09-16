import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  MaxLength,
  IsNumber
} from 'class-validator';

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
    mean_size?: number;

    @IsOptional()
    @IsNumber()
    mean_weight?: number;

    @IsNotEmpty()
    @IsString()
    diet: string;

    @IsOptional()
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
    minSize: number;

    @IsNotEmpty()
    @IsNumber()
    maxSize: number;
}

export class FilterByWeightDto {
    @IsNotEmpty()
    @IsNumber()
    minWeight: number;

    @IsNotEmpty()
    @IsNumber()
    maxWeight: number;
}
