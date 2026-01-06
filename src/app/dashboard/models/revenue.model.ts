export type GroupBy = 'day' | 'week' | 'month' | 'quarter';

export interface RevenueData {
  period: string;
  revenue: number;
  customerCount: number;
  orderCount: number;
}

export interface RevenueResponse {
  data: RevenueData[];
  groupBy: GroupBy;
  fromDate?: string;
  toDate?: string;
}

export interface RevenueStats {
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  avgRevenuePerCustomer: number;
}
