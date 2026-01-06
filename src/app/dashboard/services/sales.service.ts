import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  FilterParams,
  KPIMetrics,
  StatusDistribution,
  PerformanceData,
  TopPerformer,
  SaleRow
} from '../models/sale-row.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  // API URL should be configured via environment variables in production
  private readonly apiUrl = 'http://localhost:3000/api/dedup/rows';

  constructor(private http: HttpClient) {}

  /**
   * Fetch paginated sales data from API
   */
  getSalesData(filters: FilterParams): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('limit', filters.limit.toString())
      .set('offset', filters.offset.toString());

    if (filters.status && filters.status !== 'all') {
      params = params.set('status', filters.status);
    }

    if (filters.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }

    if (filters.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  /**
   * Calculate KPI metrics from sales data
   */
  calculateKPIMetrics(data: SaleRow[], total: number): KPIMetrics {
    const successCount = data.filter(row => row.status === 'success').length;
    const failedCount = data.filter(row => row.status === 'failed').length;
    const duplicateCount = data.filter(row => row.status === 'duplicate').length;
    const pendingCount = data.filter(row => row.status === 'pending').length;
    const totalAmount = data.reduce((sum, row) => sum + row.amount, 0);

    return {
      totalRecords: total,
      successCount,
      failedCount,
      duplicateCount,
      pendingCount,
      totalAmount
    };
  }

  /**
   * Get status distribution for chart
   */
  getStatusDistribution(data: SaleRow[]): StatusDistribution[] {
    const statusColors: Record<string, string> = {
      success: '#10b981',
      failed: '#ef4444',
      duplicate: '#f59e0b',
      pending: '#3b82f6'
    };

    const distribution = data.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6b7280'
    }));
  }

  /**
   * Get performance data over time (last 7 days)
   */
  getPerformanceOverTime(data: SaleRow[]): PerformanceData[] {
    const last7Days = this.getLast7Days();
    const groupedByDate = data.reduce((acc, row) => {
      const date = new Date(row.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { successCount: 0, failedCount: 0 };
      }
      if (row.status === 'success') {
        acc[date].successCount++;
      } else if (row.status === 'failed') {
        acc[date].failedCount++;
      }
      return acc;
    }, {} as Record<string, { successCount: number; failedCount: number }>);

    return last7Days.map(date => ({
      date,
      successCount: groupedByDate[date]?.successCount || 0,
      failedCount: groupedByDate[date]?.failedCount || 0
    }));
  }

  /**
   * Get top 5 performers by total amount
   */
  getTopPerformers(data: SaleRow[]): TopPerformer[] {
    const performerMap = data.reduce((acc, row) => {
      if (!acc[row.saleName]) {
        acc[row.saleName] = { transactionCount: 0, totalAmount: 0 };
      }
      acc[row.saleName].transactionCount++;
      acc[row.saleName].totalAmount += row.amount;
      return acc;
    }, {} as Record<string, { transactionCount: number; totalAmount: number }>);

    const performers = Object.entries(performerMap)
      .map(([name, stats]) => ({
        name,
        transactionCount: stats.transactionCount,
        totalAmount: stats.totalAmount
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((performer, index) => ({
        rank: index + 1,
        ...performer
      }));

    return performers;
  }

  /**
   * Helper: Get last 7 days in ISO format
   */
  private getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }

  /**
   * Format currency as VND
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Format date using Vietnamese locale
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
