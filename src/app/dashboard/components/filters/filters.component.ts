import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GroupBy } from '../../models/revenue.model';

export interface FilterChangeEvent {
  searchQuery?: string;
  fromDate?: Date;
  toDate?: Date;
  groupBy?: GroupBy;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  @Output() filterChange = new EventEmitter<FilterChangeEvent>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchQuery = signal<string>('');
  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);
  groupBy = signal<GroupBy>('week');

  groupByOptions: { value: GroupBy; label: string }[] = [
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'quarter', label: 'Quý' }
  ];

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSearchSubmit(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.searchSubmit.emit(query);
    }
  }

  onFromDateChange(date: Date | null): void {
    this.fromDate.set(date);
    this.emitFilterChange();
  }

  onToDateChange(date: Date | null): void {
    this.toDate.set(date);
    this.emitFilterChange();
  }

  onGroupByChange(groupBy: GroupBy): void {
    this.groupBy.set(groupBy);
    this.emitFilterChange();
  }

  clearFilters(): void {
    this.fromDate.set(null);
    this.toDate.set(null);
    this.groupBy.set('week');
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    this.filterChange.emit({
      fromDate: this.fromDate() || undefined,
      toDate: this.toDate() || undefined,
      groupBy: this.groupBy()
    });
  }

  isNumeric(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }
}
