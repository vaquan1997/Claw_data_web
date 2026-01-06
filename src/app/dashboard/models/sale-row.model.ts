export type SaleStatus = 'success' | 'failed' | 'duplicate' | 'pending';

export interface SaleRow {
  id: string;
  status: SaleStatus;
  saleName: string;
  createdAt: string;
  amount: number;
  customerName: string;
  phone: string;
  source: string;
  [key: string]: any; // Allow dynamic property access
}

export interface ApiResponse {
  data: SaleRow[];
  total: number;
}

export interface FilterParams {
  status?: SaleStatus | 'all';
  fromDate?: string;
  toDate?: string;
  limit: number;
  offset: number;
}

export interface KPIMetrics {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  pendingCount: number;
  totalAmount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  color: string;
}

export interface PerformanceData {
  date: string;
  successCount: number;
  failedCount: number;
}

export interface TopPerformer {
  rank: number;
  name: string;
  transactionCount: number;
  totalAmount: number;
}
