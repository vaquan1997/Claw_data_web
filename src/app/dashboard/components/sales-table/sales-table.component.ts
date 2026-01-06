import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaleOrder, NoteStatus } from '../../models/sale.model';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.scss'
})
export class SalesTableComponent {
  @Input() salesData: SaleOrder[] = [];
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ orderId: string; status: NoteStatus }>();

  searchQuery = signal('');
  displayedColumns: string[] = [
    'orderCode',
    'customerName',
    'productName',
    'quantity',
    'unitPrice',
    'totalPrice',
    'createdAt',
    'paymentMethod',
    'saleStatus',
    'noteStatus'
  ];

  columnHeaders: { [key: string]: string } = {
    orderCode: 'Mã đơn',
    customerName: 'Khách hàng',
    productName: 'Sản phẩm',
    quantity: 'Số lượng',
    unitPrice: 'Đơn giá',
    totalPrice: 'Thành tiền',
    createdAt: 'Ngày tạo',
    paymentMethod: 'Thanh toán',
    saleStatus: 'Trạng thái sale',
    noteStatus: 'Tình trạng chốt'
  };

  statusOptions: { value: NoteStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Chưa chốt', color: 'gray' },
    { value: 'confirmed', label: 'Đã chốt', color: 'green' },
    { value: 'rejected', label: 'Chưa mua', color: 'red' }
  ];

  pageSizeOptions = [10, 25, 50, 100];

  onSearch(): void {
    this.searchChange.emit(this.searchQuery());
  }

  onStatusChange(orderId: string, status: NoteStatus): void {
    this.statusChange.emit({ orderId, status });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getStatusBadgeClass(status: NoteStatus): string {
    const statusMap: { [key in NoteStatus]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      rejected: 'status-rejected'
    };
    return statusMap[status] || 'status-pending';
  }

  getPaymentMethodLabel(method: string): string {
    const methodMap: { [key: string]: string } = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      transfer: 'Chuyển khoản',
      cod: 'COD'
    };
    return methodMap[method] || method;
  }

  getTotalAmount(): number {
    return this.salesData.reduce((sum, order) => sum + order.totalPrice, 0);
  }
}
