import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { RevenueChartComponent } from './components/charts/revenue-chart/revenue-chart.component';
import { CategoryChartComponent } from './components/charts/category-chart/category-chart.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';
import { KPI } from './models/kpi.model';
import { SaleOrder, NoteStatus } from './models/sale.model';
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
    SalesTableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // KPI Data
  kpis = signal<KPI[]>([
    {
      label: 'Tổng doanh thu',
      value: '$99,560',
      percentageChange: 2.6,
      trend: 'up',
      comparisonText: 'Tháng này so với tháng trước'
    },
    {
      label: 'Tổng đơn hàng',
      value: 35,
      percentageChange: 5.2,
      trend: 'up',
      comparisonText: 'Tháng này so với tháng trước'
    },
    {
      label: 'Tổng khách hàng',
      value: '45,600',
      percentageChange: 1.8,
      trend: 'up',
      comparisonText: 'Tháng này so với tháng trước'
    },
    {
      label: 'Tổng lợi nhuận',
      value: '$60,450',
      percentageChange: -0.5,
      trend: 'down',
      comparisonText: 'Tháng này so với tháng trước'
    }
  ]);

  // Chart Data
  revenueChartData = signal<any>({
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000, 28000000]
  });

  categoryChartData = signal<any>({
    labels: ['Đã chốt', 'Chưa chốt', 'Chưa mua', 'Đang xử lý'],
    data: [45, 25, 15, 15]
  });

  // Sales Data
  salesData = signal<SaleOrder[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.loading.set(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockSalesData: SaleOrder[] = Array.from({ length: 25 }, (_, i) => ({
        id: `ORDER-${1000 + i}`,
        orderCode: `DH${String(1000 + i).padStart(5, '0')}`,
        customerName: `Khách hàng ${i + 1}`,
        productName: `Sản phẩm ${String.fromCharCode(65 + (i % 26))}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        unitPrice: Math.floor(Math.random() * 1000000) + 100000,
        totalPrice: 0, // Will be calculated
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: ['cash', 'card', 'transfer', 'cod'][Math.floor(Math.random() * 4)] as any,
        saleStatus: ['Thành công', 'Đang xử lý', 'Hoàn thành'][Math.floor(Math.random() * 3)],
        noteStatus: ['pending', 'confirmed', 'rejected'][Math.floor(Math.random() * 3)] as NoteStatus
      }));

      // Calculate total price for each order
      mockSalesData.forEach(order => {
        order.totalPrice = order.unitPrice * order.quantity;
      });

      this.salesData.set(mockSalesData);
      this.totalRecords.set(100); // Mock total
      this.loading.set(false);
    }, 1000);
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    // Here you would typically fetch new data based on the page
    this.loadMockData();
  }

  onSearchChange(query: string): void {
    console.log('Search query:', query);
    // Here you would typically filter or fetch data based on the search query
  }

  onStatusChange(event: { orderId: string; status: NoteStatus }): void {
    console.log('Status changed:', event);
    // Update the order status in the data
    this.salesData.update(data => 
      data.map(order => 
        order.id === event.orderId 
          ? { ...order, noteStatus: event.status }
          : order
      )
    );
  }
}
