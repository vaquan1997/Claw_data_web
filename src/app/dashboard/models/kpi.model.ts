export interface KPI {
  label: string;
  value: string | number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
  comparisonText: string;
  icon?: string;
}
