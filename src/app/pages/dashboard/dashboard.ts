import { Component, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TransactionsService } from '../../services/transactions';
import { CategoriesService } from '../../services/categories';
import { BalanceCards } from '../../components/balance-cards/balance-cards';
import { SpendingChart } from '../../components/spending-chart/spending-chart';
import { IncomeExpenseChart } from '../../components/income-expense-chart/income-expense-chart';

@Component({
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    BalanceCards,
    SpendingChart,
    IncomeExpenseChart,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  protected readonly transactionsService = inject(TransactionsService);
  protected readonly categoriesService = inject(CategoriesService);

  protected readonly availableMonths = signal<string[]>([]);

  ngOnInit(): void {
    const months = new Set<string>();
    for (const tx of this.transactionsService.transactions()) {
      months.add(tx.date.slice(0, 7));
    }
    this.availableMonths.set([...months].sort().reverse());
  }

  protected onMonthChange(month: string): void {
    this.transactionsService.setSelectedMonth(month);
  }
}
