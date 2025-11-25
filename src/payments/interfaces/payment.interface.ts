import { ChangePaymentStatusDto, CreatePaymentDto } from '../dtos/payment.dto';

export enum paymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export enum paymentMethod {
  CREDIT_CARD = 'credit card',
  DEBIT_CARD = 'debit card',
  TRANSFER = 'transfer',
}

export interface Payment {
  payment_id: string;
  order_id: string;
  total: number;
  payment_method: string;
  status: paymentStatus;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentServiceInterface {
  createPayment(dto: CreatePaymentDto): Promise<Payment>;
  getPaymentByOrderId(order_id: string): Promise<[Payment, number]>;
  updatePaymentStatus(
    payment_id: string,
    dto: ChangePaymentStatusDto,
  ): Promise<Payment>;
}
