import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { DashboardData } from 'src/stats/interfaces/stats.interface';



@Injectable()
export class StatsRepository {
  constructor(private readonly db: DatabaseService) {}

  async getDashboardData(): Promise<DashboardData> {
    // Una sola query que obtiene todas las estadísticas del dashboard
    const result = await this.db.query<any>`
      WITH 
      -- Métricas generales
      current_stats AS (
        SELECT 
          COALESCE(SUM(p.total), 0) as total_sales,
          COUNT(DISTINCT o.order_id) as total_orders,
          (SELECT COUNT(*) FROM products) as total_products,
          (SELECT COUNT(*) FROM users) as total_users
        FROM orders o
        LEFT JOIN payments p ON o.order_id = p.order_id AND p.status != 'canceled'
      ),
      -- Estadísticas del mes pasado para calcular crecimiento
      previous_month_stats AS (
        SELECT 
          COALESCE(SUM(p.total), 0) as prev_sales,
          COUNT(DISTINCT o.order_id) as prev_orders
        FROM orders o
        LEFT JOIN payments p ON o.order_id = p.order_id AND p.status != 'canceled'
        WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          AND o.created_at < DATE_TRUNC('month', CURRENT_DATE)
      ),
      current_month_stats AS (
        SELECT 
          COALESCE(SUM(p.total), 0) as curr_sales,
          COUNT(DISTINCT o.order_id) as curr_orders
        FROM orders o
        LEFT JOIN payments p ON o.order_id = p.order_id AND p.status != 'canceled'
        WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
      ),
      -- Órdenes recientes
      recent_orders_data AS (
        SELECT 
          o.order_id::text,
          COALESCE(u.name || ' ' || u.last_name, u.name, 'Usuario Desconocido') as user_name,
          COALESCE(p.total, 0) as total,
          o.status,
          o.created_at::text
        FROM orders o
        LEFT JOIN users u ON o.user_id::text = u.user_id::text
        LEFT JOIN payments p ON o.order_id = p.order_id
        ORDER BY o.created_at DESC
        LIMIT 10
      ),
      -- Productos más vendidos
      top_products_data AS (
        SELECT 
          p.product_id,
          p.name,
          COALESCE(SUM(od.quantity), 0) as total_sold,
          COALESCE(SUM(od.quantity * od.unit_price), 0) as total_revenue,
          p.img
        FROM products p
        LEFT JOIN orderdetails od ON p.product_id = od.product_id
        LEFT JOIN orders o ON od.order_id = o.order_id AND o.status != 'canceled'
        GROUP BY p.product_id, p.name, p.img
        ORDER BY total_sold DESC
        LIMIT 5
      ),
      -- Agregación de datos
      aggregated_data AS (
        SELECT 
          json_build_object(
            'totalSales', cs.total_sales,
            'totalOrders', cs.total_orders,
            'totalProducts', cs.total_products,
            'totalUsers', cs.total_users,
            'salesGrowth', 
              CASE 
                WHEN pms.prev_sales > 0 THEN 
                  ROUND(((cms.curr_sales - pms.prev_sales) / pms.prev_sales * 100)::numeric, 2)
                ELSE 0
              END,
            'ordersGrowth',
              CASE 
                WHEN pms.prev_orders > 0 THEN 
                  ROUND(((cms.curr_orders - pms.prev_orders) / pms.prev_orders * 100)::numeric, 2)
                ELSE 0
              END
          ) as metrics,
          (SELECT json_agg(row_to_json(recent_orders_data)) FROM recent_orders_data) as recent_orders,
          (SELECT json_agg(row_to_json(top_products_data)) FROM top_products_data) as top_products
        FROM current_stats cs
        CROSS JOIN previous_month_stats pms
        CROSS JOIN current_month_stats cms
      )
      SELECT * FROM aggregated_data
    `;

    const row = result[0];
    
    return {
      metrics: row.metrics || {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        salesGrowth: 0,
        ordersGrowth: 0,
      },
      recentOrders: row.recent_orders || [],
      topProducts: row.top_products || [],
    };
  }
}
