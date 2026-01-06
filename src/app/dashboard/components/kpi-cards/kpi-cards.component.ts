import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPI } from '../../models/kpi.model';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.scss'
})
export class KpiCardsComponent {
  @Input() kpis: KPI[] = [];

  getTrendClass(trend: string): string {
    return trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral';
  }

  getTrendIcon(trend: string): string {
    return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  }
}
