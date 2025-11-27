import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { Payment } from 'src/payments/interfaces/payment.interface';
import { CreatePaymentDto } from 'src/payments/dtos/payment.dto';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly db: DatabaseService) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const rows = await this.db.query<Payment>`
      INSERT INTO payments (order_id, total, payment_method, status)
      VALUES (${dto.order_id}, ${dto.total}, ${dto.payment_method}, 'pending')
      RETURNING *`;
    return rows[0];
  }

  async getPaymentByOrderId(order_id: string): Promise<[Payment, number]> {
    const rows = await this.db.query<[Payment, number]>`
      SELECT p.*, o.user_id FROM payments p
      JOIN orders o ON o.order_id = p.order_id
      WHERE p.order_id = ${order_id}`;
    return rows[0];
  }

  async updatePaymentStatus(
    payment_id: string,
    status: string,
  ): Promise<Payment> {
    const rows = await this.db.query<Payment>`
      UPDATE payments
      SET status = ${status}, updated_at = NOW()
      WHERE payment_id = ${payment_id}
      RETURNING *`;
    return rows[0];
  }
}
