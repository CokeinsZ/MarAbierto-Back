import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { Order } from 'src/orders/interfaces/orders.interface';
import { Product } from 'src/products/interfaces/product.interface';
import { CreateOrderDto } from 'src/orders/dtos/orders.dtos';

@Injectable()
export class OrdersRepository {
  constructor(private readonly db: DatabaseService) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    // Crea la orden, inserta los detalles y crea el pago en una sola query usando CTEs
    const orders = await this.db.query<Order>`
      WITH new_order AS (
        INSERT INTO orders (user_id, status)
        VALUES (${dto.user_id}, 'pending')
        RETURNING order_id
      ),
      items AS (
        SELECT
          (elem->>'id')::int        AS product_id,
          (elem->>'quantity')::int  AS quantity
        FROM jsonb_array_elements(${JSON.stringify(dto.products)}::jsonb) AS elem
      ),
      priced AS (
        SELECT i.product_id, p.price AS unit_price, i.quantity
        FROM items i
        JOIN products p ON p.product_id = i.product_id
      ),
      ins_details AS (
        INSERT INTO orderdetails (order_id, product_id, unit_price, quantity)
        SELECT (SELECT order_id FROM new_order), product_id, unit_price, quantity
        FROM priced
        RETURNING *
      ),
      ins_payment AS (
        INSERT INTO payments (order_id, total, payment_method, status)
        SELECT n.order_id,
               COALESCE((SELECT SUM(unit_price * quantity) FROM priced), 0) AS total,
               ${dto.payment_method},
               'pending'
        FROM new_order n
        RETURNING *
      )
      SELECT o.*
      FROM orders o
      JOIN new_order n ON o.order_id = n.order_id`;
    return orders[0];
  }

  async getOrderById(order_id: string): Promise<Order | null> {
    const orders = await this.db.query<Order>`
      SELECT * FROM orders
      WHERE order_id = ${order_id}`;
    return orders[0] || null;
  }

  async listOrdersByUser(user_id: string): Promise<Order[]> {
    const orders = await this.db.query<Order>`
      SELECT * FROM orders
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC`;
    return orders;
  }

  async updateOrderStatus(
    order_id: string,
    status: string,
  ): Promise<Order> {
    const orders = await this.db.query<Order>`
      UPDATE orders
      SET status = ${status}, updated_at = NOW()
      WHERE order_id = ${order_id}
      RETURNING *`;
    return orders[0];
  }

  async getOrderProducts(order_id: string): Promise<Product[]> {
    const rows = await this.db.query<Product>`
      SELECT p.*
      FROM orderdetails od
      JOIN products p ON p.product_id = od.product_id
      WHERE od.order_id = ${order_id}`;
    return rows;
  }

  async getOrderUser(order_id: string): Promise<{
    user_id: string;
    name: string;
    national_id: string;
    address: string;
    phone: string;
    email: string;
  } | null> {
    const rows = await this.db.unsafe<any>(
      `SELECT u.user_id::text, u.name, u.national_id, u.address, u.phone, u.email
       FROM users u
       JOIN orders o ON o.user_id = u.user_id::text OR o.user_id::text = u.user_id::text
       WHERE o.order_id = $1
       LIMIT 1`,
      [order_id],
    );
    return rows[0] || null;
  }

  async cancelOrder(order_id: string): Promise<Order> {
    // Cancela la orden y su pago asociado en una sola operación
    const rows = await this.db.query<Order>`
      WITH upd_order AS (
        UPDATE orders
        SET status = 'canceled', updated_at = NOW()
        WHERE order_id = ${order_id}
        RETURNING *
      ), upd_payment AS (
        UPDATE payments
        SET status = 'canceled', updated_at = NOW()
        WHERE order_id = ${order_id}
        RETURNING *
      )
      SELECT * FROM upd_order`;
    return rows[0];
  }

}
