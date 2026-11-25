import { Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Category } from '../../models/category.model';

@Component({
  imports: [BaseChartDirective],
  selector: 'app-spending-chart',
  styleUrl: './spending-chart.scss',
  templateUrl: './spending-chart.html',
})
export class SpendingChart {
  readonly spendingByCategory = input.required<Record<string, number>>();
  readonly categoryMap = input.required<Map<string, Category>>();

  protected readonly chartData = computed((): ChartData<'doughnut'> => {
    const spending = this.spendingByCategory();
    const catMap = this.categoryMap();
    const entries = Object.entries(spending).filter(([, amount]) => amount > 0);

    return {
      labels: entries.map(([catId]) => catMap.get(catId)?.name ?? 'Unknown'),
      datasets: [
        {
          data: entries.map(([, amount]) => amount),
          backgroundColor: entries.map(
            ([catId]) => catMap.get(catId)?.color ?? '#999',
          ),
          borderWidth: 2,
        },
      ],
    };
  });

  protected readonly chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
}
