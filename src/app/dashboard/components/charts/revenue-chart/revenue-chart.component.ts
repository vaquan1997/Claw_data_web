import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartConfiguration, ChartType } from 'chart.js';
import { RevenueData } from '../../../models/revenue.model';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatButtonToggleModule],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.scss'
})
export class RevenueChartComponent implements OnInit, OnChanges {
  @Input() data: RevenueData[] = [];

  chartType = signal<ChartType>('bar');

  public chartOptions: ChartConfiguration['options'] = {
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

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartData();
    }
  }

  toggleChartType(type: ChartType): void {
    this.chartType.set(type);
  }

  private updateChartData(): void {
    const labels = this.data.map(item => item.period);
    const revenues = this.data.map(item => item.revenue);
    
    this.chartData = {
      labels: labels.length > 0 ? labels : ['Chưa có dữ liệu'],
      datasets: [
        {
          label: 'Doanh thu',
          data: revenues.length > 0 ? revenues : [0],
          backgroundColor: this.chartType() === 'bar' ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          borderWidth: this.chartType() === 'line' ? 2 : 0,
          borderRadius: this.chartType() === 'bar' ? 8 : 0,
          borderSkipped: false,
          tension: 0.4,
          fill: this.chartType() === 'line'
        }
      ]
    };
  }
}
