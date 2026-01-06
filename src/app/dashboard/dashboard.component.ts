import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { SalesService } from './services/sales.service';
import {
  SaleRow,
  KPIMetrics,
  StatusDistribution,
  PerformanceData,
  TopPerformer,
  FilterParams,
  SaleStatus
} from './models/sale-row.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // State signals
  salesData = signal<SaleRow[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Pagination signals
  currentPage = signal<number>(0);
  pageSize = signal<number>(25);
  totalRecords = signal<number>(0);
  
  // Filter signals
  selectedStatus = signal<SaleStatus | 'all'>('all');
  fromDate = signal<string>('');
  toDate = signal<string>('');
  
  // Analytics signals
  kpiMetrics = signal<KPIMetrics>({
    totalRecords: 0,
    successCount: 0,
    failedCount: 0,
    duplicateCount: 0,
    pendingCount: 0,
    totalAmount: 0
  });
  statusDistribution = signal<StatusDistribution[]>([]);
  performanceData = signal<PerformanceData[]>([]);
  topPerformers = signal<TopPerformer[]>([]);
  
  // Computed values
  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));
  startRecord = computed(() => this.currentPage() * this.pageSize() + 1);
  endRecord = computed(() => Math.min((this.currentPage() + 1) * this.pageSize(), this.totalRecords()));
  isEmpty = computed(() => this.salesData().length === 0 && !this.loading());
  
  // Status options for filter
  statusOptions: Array<{ value: SaleStatus | 'all', label: string }> = [
    { value: 'all', label: 'Tất cả' },
    { value: 'success', label: 'Thành công' },
    { value: 'failed', label: 'Thất bại' },
    { value: 'duplicate', label: 'Trùng lặp' },
    { value: 'pending', label: 'Đang chờ' }
  ];
  
  // Page size options
  pageSizeOptions = [10, 25, 50, 100];
  
  // Table columns (will be auto-generated from first data row)
  tableColumns = signal<string[]>([]);

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load sales data from API
   */
  loadData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    const filters: FilterParams = {
      limit: this.pageSize(),
      offset: this.currentPage() * this.pageSize(),
      status: this.selectedStatus(),
      fromDate: this.fromDate() || undefined,
      toDate: this.toDate() || undefined
    };

    this.salesService.getSalesData(filters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.salesData.set(response.data);
          this.totalRecords.set(response.total);
          
          // Generate table columns from first row
          if (response.data.length > 0) {
            this.tableColumns.set(Object.keys(response.data[0]));
          }
          
          // Calculate analytics
          this.updateAnalytics(response.data, response.total);
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.error.set('Lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
      });
  }

  /**
   * Update analytics data
   */
  private updateAnalytics(data: SaleRow[], total: number): void {
    this.kpiMetrics.set(this.salesService.calculateKPIMetrics(data, total));
    this.statusDistribution.set(this.salesService.getStatusDistribution(data));
    this.performanceData.set(this.salesService.getPerformanceOverTime(data));
    this.topPerformers.set(this.salesService.getTopPerformers(data));
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    this.currentPage.set(0);
    this.loadData();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedStatus.set('all');
    this.fromDate.set('');
    this.toDate.set('');
    this.currentPage.set(0);
    this.loadData();
  }

  /**
   * Change page size
   */
  onPageSizeChange(): void {
    this.currentPage.set(0);
    this.loadData();
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }

  /**
   * Get page numbers to display
   */
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    // Show max 5 pages around current page
    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, current + 2);
    
    // Adjust if near boundaries
    if (current <= 2) {
      end = Math.min(4, total - 1);
    }
    if (current >= total - 3) {
      start = Math.max(0, total - 5);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      success: 'badge-success',
      failed: 'badge-failed',
      duplicate: 'badge-duplicate',
      pending: 'badge-pending'
    };
    return statusMap[status] || 'badge-default';
  }

  /**
   * Get status label in Vietnamese
   */
  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      success: 'Thành công',
      failed: 'Thất bại',
      duplicate: 'Trùng lặp',
      pending: 'Đang chờ'
    };
    return statusMap[status] || status;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return this.salesService.formatCurrency(amount);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return this.salesService.formatDate(dateString);
  }

  /**
   * Get trend indicator
   */
  getTrendIndicator(value: number): string {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  }

  /**
   * Calculate percentage for status distribution chart
   */
  getPercentage(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  /**
   * Retry loading data after error
   */
  retryLoad(): void {
    this.loadData();
  }
}
