import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from 'src/databases/repositories/payments/payments.repository';
import { Payment, PaymentServiceInterface } from './interfaces/payment.interface';
import { CreatePaymentDto, ChangePaymentStatusDto } from './dtos/payment.dto';

@Injectable()
export class PaymentsService implements PaymentServiceInterface {
	constructor(private readonly repo: PaymentsRepository) {}

	createPayment(dto: CreatePaymentDto): Promise<Payment> {
		return this.repo.createPayment(dto);
	}

	getPaymentByOrderId(order_id: string): Promise<[Payment, number]> {
		return this.repo.getPaymentByOrderId(order_id);
	}

	async updatePaymentStatus(payment_id: string, dto: ChangePaymentStatusDto): Promise<Payment> {
		const updated = await this.repo.updatePaymentStatus(payment_id, dto.status);
		if (!updated) throw new NotFoundException('Payment not found');
		return updated;
	}
}
