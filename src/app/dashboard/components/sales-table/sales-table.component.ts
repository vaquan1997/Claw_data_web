import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    'customerName',
    'phone',
    'productName',
    'quantity',
    'unitPrice',
    'totalPrice',
    'createdAt',
    'noteStatus'
  ];

  columnHeaders: { [key: string]: string } = {
    customerName: 'Tên khách hàng',
    phone: 'Số điện thoại',
    productName: 'Sản phẩm',
    quantity: 'Số lượng',
    unitPrice: 'Đơn giá',
    totalPrice: 'Thành tiền',
    createdAt: 'Ngày tạo',
    noteStatus: 'Trạng thái chăm sóc'
  };

  statusOptions: { value: NoteStatus; label: string; color: string }[] = [
    { value: 'new', label: 'Khách mới', color: '#9E9E9E' },
    { value: 'closed', label: 'Đã chốt', color: '#4CAF50' },
    { value: 'reference', label: 'Tham khảo', color: '#2196F3' },
    { value: 'nurturing', label: 'Chăm sóc', color: '#FF9800' }
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
      new: 'status-new',
      closed: 'status-closed',
      reference: 'status-reference',
      nurturing: 'status-nurturing'
    };
    return statusMap[status] || 'status-new';
  }

  getStatusColor(status: NoteStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.color || '#9E9E9E';
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
