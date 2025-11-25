export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesGrowth: number;
  ordersGrowth: number;
}

export interface RecentOrder {
  order_id: string;
  user_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface TopProduct {
  product_id: number;
  name: string;
  total_sold: number;
  total_revenue: number;
  img?: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}