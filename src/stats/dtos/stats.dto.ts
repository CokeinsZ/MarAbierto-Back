export class DashboardMetricsDto {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesGrowth: number;
  ordersGrowth: number;
}

export class RecentOrderDto {
  order_id: string;
  user_name: string;
  total: number;
  status: string;
  created_at: string;
}

export class TopProductDto {
  product_id: number;
  name: string;
  total_sold: number;
  total_revenue: number;
  img?: string;
}

export class DashboardDataDto {
  metrics: DashboardMetricsDto;
  recentOrders: RecentOrderDto[];
  topProducts: TopProductDto[];
}