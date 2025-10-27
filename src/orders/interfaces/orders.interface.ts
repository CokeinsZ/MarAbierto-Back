import {
  Payment,
  paymentStatus,
} from 'src/payments/interfaces/payment.interface';
import { Product } from 'src/products/interfaces/product.interface';
import type { CreateOrderDto, UpdateOrderStatusDto } from '../dtos/orders.dtos';

export enum orderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  SENT = 'sent',
  CANCELED = 'canceled',
}

export interface Order {
  order_id: string;
  user_id: string;
  status: orderStatus;
  created_at: Date;
  updated_at: Date;
}

export interface PopulatedOrder {
  order: Order;
  products: Product[];
  payment: Payment;
  user: {
    user_id: string;
    name: string;
    national_id: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface OrderServiceInterface {
  createOrder(dto: CreateOrderDto): Promise<Order>;
  getOrderById(order_id: string): Promise<PopulatedOrder | null>;
  listOrdersByUser(user_id: string): Promise<Order[]>;
  updateOrderStatus(
    order_id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order>;
}
