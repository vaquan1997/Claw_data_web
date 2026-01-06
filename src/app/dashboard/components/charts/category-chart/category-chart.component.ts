import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss'
})
export class CategoryChartComponent implements OnInit {
  @Input() data: any;

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  public doughnutChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    this.doughnutChartData = {
      labels: this.data?.labels || ['Đã chốt', 'Chưa chốt', 'Chưa mua', 'Đang xử lý'],
      datasets: [
        {
          data: this.data?.data || [45, 25, 15, 15],
          backgroundColor: [
            '#10b981', // Green
            '#f59e0b', // Orange
            '#ef4444', // Red
            '#3b82f6'  // Blue
          ],
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };
  }
}
