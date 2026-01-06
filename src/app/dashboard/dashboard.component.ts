import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { RevenueChartComponent } from './components/charts/revenue-chart/revenue-chart.component';
import { CategoryChartComponent } from './components/charts/category-chart/category-chart.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';
import { FiltersComponent, FilterChangeEvent } from './components/filters/filters.component';
import { KPI } from './models/kpi.model';
import { SaleOrder, NoteStatus } from './models/sale.model';
import { Customer } from './models/customer.model';
import { RevenueData, GroupBy } from './models/revenue.model';
import { RevenueStats } from './models/revenue.model';
import { DedupService } from './services/dedup.service';
import { RevenueService } from './services/revenue.service';
import { catchError, finalize, of } from 'rxjs';
import './chart.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    KpiCardsComponent,
    RevenueChartComponent,
    CategoryChartComponent,
    SalesTableComponent,
    FiltersComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // KPI Data
  kpis = signal<KPI[]>([]);

  // Chart Data
  revenueChartData = signal<RevenueData[]>([]);
  categoryChartData = signal<any>({
    labels: ['Đã chốt', 'Chưa chốt', 'Chưa mua', 'Đang xử lý'],
    data: [45, 25, 15, 15]
  });

  // Sales Data
  salesData = signal<SaleOrder[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Filter state
  currentPage = signal<number>(0);
  pageSize = signal<number>(25);
  fromDate = signal<string | undefined>(undefined);
  toDate = signal<string | undefined>(undefined);
  groupBy = signal<GroupBy>('week');

  constructor(
    private dedupService: DedupService,
    private revenueService: RevenueService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadRevenueData();
  }

  loadData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const offset = this.currentPage() * this.pageSize();
    
    this.dedupService
      .getCustomerList(this.pageSize(), offset, this.fromDate(), this.toDate())
      .pipe(
        catchError(error => {
          console.error('Error loading customer data:', error);
          this.errorMessage.set('Không thể tải dữ liệu. Vui lòng thử lại sau.');
          return of({ data: [], total: 0, limit: this.pageSize(), offset: 0 });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(response => {
        // Transform Customer data to SaleOrder format
        const orders: SaleOrder[] = response.data.map((customer, index) => ({
          id: customer.id || `order-${offset + index}`,
          orderCode: `DH${String(offset + index + 1).padStart(5, '0')}`,
          customerName: customer.customerName,
          phone: customer.phone,
          productName: customer.product,
          quantity: customer.quantity,
          unitPrice: customer.unitPrice,
          totalPrice: customer.quantity * customer.unitPrice,
          createdAt: customer.createdAt,
          paymentMethod: 'transfer',
          saleStatus: 'Hoàn thành',
          noteStatus: customer.saleNoteStatus || 'new'
        }));

        this.salesData.set(orders);
        this.totalRecords.set(response.total);
        
        // Calculate KPIs from current data
        this.updateKPIs(orders);
      });
  }

  loadRevenueData(): void {
    this.revenueService
      .getRevenueStats(this.groupBy(), this.fromDate(), this.toDate())
      .pipe(
        catchError(error => {
          console.error('Error loading revenue data:', error);
          return of({ data: [], groupBy: this.groupBy() });
        })
      )
      .subscribe(response => {
        this.revenueChartData.set(response.data);
        
        // Update KPIs from revenue data
        const stats = this.revenueService.calculateStats(response);
        this.updateKPIsFromRevenue(stats);
      });
  }

  updateKPIs(orders: SaleOrder[]): void {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(order => order.phone)).size;

    this.kpis.set([
      {
        label: 'Tổng doanh thu',
        value: this.formatCurrency(totalRevenue),
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Tổng doanh thu từ dữ liệu hiện tại'
      },
      {
        label: 'Tổng số khách hàng',
        value: uniqueCustomers,
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Số khách hàng duy nhất'
      },
      {
        label: 'Tổng số đơn',
        value: totalOrders,
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Tổng số đơn hàng'
      },
      {
        label: 'Doanh thu TB / khách',
        value: uniqueCustomers > 0 ? this.formatCurrency(totalRevenue / uniqueCustomers) : '0 ₫',
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Doanh thu trung bình mỗi khách hàng'
      }
    ]);
  }

  updateKPIsFromRevenue(stats: RevenueStats): void {
    this.kpis.set([
      {
        label: 'Tổng doanh thu',
        value: this.formatCurrency(stats.totalRevenue),
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Tổng doanh thu'
      },
      {
        label: 'Tổng số khách hàng',
        value: stats.totalCustomers,
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Tổng số khách hàng'
      },
      {
        label: 'Tổng số đơn',
        value: stats.totalOrders,
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Tổng số đơn hàng'
      },
      {
        label: 'Doanh thu TB / khách',
        value: this.formatCurrency(stats.avgRevenuePerCustomer),
        percentageChange: 0,
        trend: 'neutral',
        comparisonText: 'Doanh thu trung bình mỗi khách hàng'
      }
    ]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  onSearchChange(query: string): void {
    const trimmedQuery = query.trim();
    
    // Check if query is numeric (phone number)
    if (/^\d+$/.test(trimmedQuery)) {
      this.searchByPhone(trimmedQuery);
    } else {
      // Client-side filter by customer name
      this.filterByName(trimmedQuery);
    }
  }

  searchByPhone(phone: string): void {
    this.loading.set(true);
    
    this.dedupService
      .searchByPhone(phone)
      .pipe(
        catchError(error => {
          console.error('Error searching by phone:', error);
          this.errorMessage.set('Không tìm thấy khách hàng với số điện thoại này.');
          return of({ data: null });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(response => {
        if (response.data) {
          const customer = response.data;
          const order: SaleOrder = {
            id: customer.id,
            orderCode: `SEARCH-${customer.id}`,
            customerName: customer.customerName,
            phone: customer.phone,
            productName: customer.product,
            quantity: customer.quantity,
            unitPrice: customer.unitPrice,
            totalPrice: customer.quantity * customer.unitPrice,
            createdAt: customer.createdAt,
            paymentMethod: 'transfer',
            saleStatus: 'Hoàn thành',
            noteStatus: customer.saleNoteStatus || 'new'
          };
          
          this.salesData.set([order]);
          this.totalRecords.set(1);
          this.updateKPIs([order]);
        } else {
          this.salesData.set([]);
          this.totalRecords.set(0);
        }
      });
  }

  filterByName(name: string): void {
    // For client-side filtering, reload data and filter
    // In a real application, this would be a server-side filter
    this.loadData();
  }

  onFilterChange(filter: FilterChangeEvent): void {
    if (filter.fromDate) {
      this.fromDate.set(filter.fromDate.toISOString().split('T')[0]);
    } else {
      this.fromDate.set(undefined);
    }
    
    if (filter.toDate) {
      this.toDate.set(filter.toDate.toISOString().split('T')[0]);
    } else {
      this.toDate.set(undefined);
    }
    
    if (filter.groupBy) {
      this.groupBy.set(filter.groupBy);
    }
    
    // Reload data with new filters
    this.currentPage.set(0);
    this.loadData();
    this.loadRevenueData();
  }

  onStatusChange(event: { orderId: string; status: NoteStatus }): void {
    // Update the order status in the data
    this.salesData.update(data => 
      data.map(order => 
        order.id === event.orderId 
          ? { ...order, noteStatus: event.status }
          : order
      )
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
