import { Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { MonthlyTotal } from '../../services/transactions';

@Component({
  imports: [BaseChartDirective],
  selector: 'app-income-expense-chart',
  styleUrl: './income-expense-chart.scss',
  templateUrl: './income-expense-chart.html',
})
export class IncomeExpenseChart {
  readonly monthlyTotals = input.required<MonthlyTotal[]>();

  protected readonly chartData = computed((): ChartData<'bar'> => {
    const totals = this.monthlyTotals();
    return {
      labels: totals.map((t) => t.month),
      datasets: [
        {
          label: 'Income',
          data: totals.map((t) => t.income),
          backgroundColor: '#4caf50',
        },
        {
          label: 'Expenses',
          data: totals.map((t) => t.expenses),
          backgroundColor: '#f44336',
        },
      ],
    };
  });

  protected readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€${value}`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
}
