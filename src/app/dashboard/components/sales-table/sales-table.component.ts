import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SaleOrder, NoteStatus } from '../../models/sale.model';
import { DedupService } from '../../services/dedup.service';
import { Sale, mapModelToApi, SALE_STATUS_OPTIONS, getApiStatusValue } from '../../utils/field-mapper';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule
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
  @Output() dataRefresh = new EventEmitter<void>();

  searchQuery = signal('');
  editingRowId: string | null = null;
  editForm: Partial<Sale> = {};
  savingRowId: string | null = null;
  
  displayedColumns: string[] = [
    'customerName',
    'phone',
    'productName',
    'quantity',
    'unitPrice',
    'totalPrice',
    'createdAt',
    'noteStatus',
    'actions'
  ];

  columnHeaders: { [key: string]: string } = {
    customerName: 'Tên khách hàng',
    phone: 'Số điện thoại',
    productName: 'Sản phẩm',
    quantity: 'Số lượng',
    unitPrice: 'Đơn giá',
    totalPrice: 'Thành tiền',
    createdAt: 'Ngày tạo',
    noteStatus: 'Trạng thái chăm sóc',
    actions: 'Thao tác'
  };

  statusOptions = SALE_STATUS_OPTIONS;

  pageSizeOptions = [10, 25, 50, 100];

  constructor(
    private dedupService: DedupService,
    private snackBar: MatSnackBar
  ) {}

  onSearch(): void {
    this.searchChange.emit(this.searchQuery());
  }

  onStatusChange(orderId: string, status: NoteStatus): void {
    this.statusChange.emit({ orderId, status });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
   * Start editing a row
   */
  startEdit(row: SaleOrder): void {
    this.editingRowId = row.id;
    this.editForm = {
      customerName: row.customerName,
      phone: row.phone,
      saleStatus: this.getApiStatusFromNoteStatus(row.noteStatus)
    };
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingRowId = null;
    this.editForm = {};
  }

  /**
   * Check if row is in edit mode
   */
  isEditing(rowId: string): boolean {
    return this.editingRowId === rowId;
  }

  /**
   * Check if row is being saved
   */
  isSaving(rowId: string): boolean {
    return this.savingRowId === rowId;
  }

  /**
   * Save edited row
   */
  async saveEdit(row: SaleOrder): Promise<void> {
    this.savingRowId = row.id;
    
    try {
      // Prepare API payload with only editable fields
      const apiPayload = mapModelToApi({
        customerName: this.editForm.customerName,
        phone: this.editForm.phone,
        saleStatus: this.editForm.saleStatus
      });

      // Determine which API endpoint to use
      if (row.id && row.id !== `order-${row.id}` && row.id !== `SEARCH-${row.id}`) {
        // Use ID-based update
        await firstValueFrom(this.dedupService.updateById(parseInt(row.id), apiPayload));
      } else if (row.phone) {
        // Use phone-based update
        await firstValueFrom(this.dedupService.updateByPhone(row.phone, apiPayload));
      } else {
        throw new Error('Không thể cập nhật: Không có ID hoặc số điện thoại hợp lệ');
      }

      this.snackBar.open('Cập nhật thành công!', 'Đóng', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });

      this.editingRowId = null;
      this.editForm = {};
      
      // Emit refresh event to reload data
      this.dataRefresh.emit();
      
    } catch (error) {
      console.error('Error updating row:', error);
      this.snackBar.open('Lỗi khi cập nhật. Vui lòng thử lại.', 'Đóng', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    } finally {
      this.savingRowId = null;
    }
  }

  /**
   * Get API status value from NoteStatus
   */
  getApiStatusFromNoteStatus(noteStatus: NoteStatus): string {
    return getApiStatusValue(noteStatus);
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
