import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from 'src/databases/repositories/orders/orders.repository';
import { PaymentsRepository } from 'src/databases/repositories/payments/payments.repository';
import { Order, OrderServiceInterface, PopulatedOrder } from './interfaces/orders.interface';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/orders.dtos';
import { MailService } from 'src/mails/mail.service';

@Injectable()
export class OrdersService implements OrderServiceInterface {
	constructor(
		private readonly ordersRepository: OrdersRepository,
		private readonly paymentsRepository: PaymentsRepository,
		private readonly mailService: MailService,
	) {}

	async createOrder(dto: CreateOrderDto): Promise<Order> {
		if (!dto.products || dto.products.length === 0) {
			throw new BadRequestException('Order must contain at least one product');
		}
		const created = await this.ordersRepository.createOrder(dto);
		return created;
	}

	async getOrderById(order_id: string): Promise<PopulatedOrder | null> {
		const order = await this.ordersRepository.getOrderById(order_id);
		if (!order) return null;
		const [products, payment, user] = await Promise.all([
			this.ordersRepository.getOrderProducts(order_id),
			this.paymentsRepository.getPaymentByOrderId(order_id),
			this.ordersRepository.getOrderUser(order_id),
		]);
		return {
			order,
			products,
			payment: payment[0],
			user: user || {
				user_id: order.user_id,
				name: '',
				national_id: '',
				address: '',
				phone: '',
				email: '',
			},
		};
	}

	async listOrdersByUser(user_id: string): Promise<Order[]> {
		return this.ordersRepository.listOrdersByUser(user_id);
	}

	async listAllOrders(page: number, max: number): Promise<Order[]> {
		const offset = (page - 1) * max;
		return this.ordersRepository.listAllOrders(offset, max);
	}

	async updateOrderStatus(order_id: string, dto: UpdateOrderStatusDto): Promise<Order> {
		const existing = await this.ordersRepository.getOrderById(order_id);
		if (!existing) throw new NotFoundException('Order not found');
		
		const updated = await this.ordersRepository.updateOrderStatus(order_id, dto.status);
		
		// Enviar correo al usuario
		try {
			const user = await this.ordersRepository.getOrderUser(order_id);
			if (user && user.email) {
				await this.mailService.sendOrderStatusChangeEmail(
					user.email,
					user.name,
					order_id,
					dto.status,
				);
			}
		} catch (error) {
			// Log error pero no fallar la actualización
			console.error('Error sending order status email:', error);
		}
		
		return updated;
	}

		async cancelOrder(order_id: string): Promise<Order> {
			const existing = await this.ordersRepository.getOrderById(order_id);
			if (!existing) throw new NotFoundException('Order not found');
			if (existing.status === 'canceled') return existing;
			
			const canceled = await this.ordersRepository.cancelOrder(order_id);
			
			// Enviar correo al usuario
			try {
				const user = await this.ordersRepository.getOrderUser(order_id);
				if (user && user.email) {
					await this.mailService.sendOrderStatusChangeEmail(
						user.email,
						user.name,
						order_id,
						'canceled',
					);
				}
			} catch (error) {
				// Log error pero no fallar la cancelación
				console.error('Error sending order cancellation email:', error);
			}
			
			return canceled;
		}
}
