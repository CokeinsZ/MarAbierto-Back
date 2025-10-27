import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { paymentStatus } from '../interfaces/payment.interface';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  total: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  payment_method: string;
}

export class ChangePaymentStatusDto {
  @IsNotEmpty()
  @IsEnum(paymentStatus, {
    message: `status must be one of: ${Object.values(paymentStatus).join(', ')}`,
  })
  status: paymentStatus;
}
