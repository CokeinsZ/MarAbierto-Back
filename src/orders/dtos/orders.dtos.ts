import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { orderStatus } from '../interfaces/orders.interface';
import { paymentMethod } from 'src/payments/interfaces/payment.interface';

export class ProductItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  user_id: string;

  @IsNotEmpty()
  @IsEnum(paymentMethod)
  payment_method: paymentMethod;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((p: any) =>
          Array.isArray(p) ? { id: p[0], quantity: p[1] } : p,
        )
      : value,
  )
  products: ProductItemDto[];
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(orderStatus, {
    message: `status must be one of: ${Object.values(orderStatus).join(', ')}`,
  })
  status: string;
}
