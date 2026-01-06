import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  collapsed = signal(false);

  menuItems = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard', active: true },
    { icon: '🛒', label: 'Đơn hàng', route: '/orders', active: false },
    { icon: '👥', label: 'Khách hàng', route: '/customers', active: false },
    { icon: '📦', label: 'Sản phẩm', route: '/products', active: false },
    { icon: '📈', label: 'Báo cáo', route: '/reports', active: false },
    { icon: '⚙️', label: 'Cài đặt', route: '/settings', active: false }
  ];

  toggleSidebar(): void {
    this.collapsed.update(val => !val);
  }
}
