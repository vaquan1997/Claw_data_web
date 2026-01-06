import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.scss'
})
export class RevenueChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() data: any;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? 0;
            return `Doanh thu: ${new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value as number);
          }
        }
      }
    }
  };

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    const gradient = this.createGradient();
    
    this.barChartData = {
      labels: this.data?.labels || ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      datasets: [
        {
          data: this.data?.data || [12000000, 19000000, 15000000, 25000000, 22000000, 30000000, 28000000],
          backgroundColor: gradient,
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    };
  }

  private createGradient(): string {
    return '#3b82f6';
  }
}
