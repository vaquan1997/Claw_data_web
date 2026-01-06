import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RevenueResponse, GroupBy, RevenueStats } from '../models/revenue.model';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private readonly apiUrl = 'http://localhost:3000/api/revenue';

  constructor(private http: HttpClient) {}

  /**
   * Get revenue statistics over time
   * @param groupBy - Grouping period: day, week, month, or quarter
   * @param fromDate - Optional start date filter
   * @param toDate - Optional end date filter
   */
  getRevenueStats(
    groupBy: GroupBy = 'week',
    fromDate?: string,
    toDate?: string
  ): Observable<RevenueResponse> {
    let params = new HttpParams().set('groupBy', groupBy);

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<RevenueResponse>(this.apiUrl, { params });
  }

  /**
   * Calculate aggregate statistics from revenue data
   */
  calculateStats(revenueData: RevenueResponse): RevenueStats {
    const { data } = revenueData;

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalCustomers = data.reduce((sum, item) => sum + item.customerCount, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);
    const avgRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      totalRevenue,
      totalCustomers,
      totalOrders,
      avgRevenuePerCustomer
    };
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
}
