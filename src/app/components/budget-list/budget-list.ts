import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BudgetStatus } from '../../services/budgets';
import { Category } from '../../models/category.model';

@Component({
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  selector: 'app-budget-list',
  styleUrl: './budget-list.scss',
  templateUrl: './budget-list.html',
})
export class BudgetList {
  readonly budgetStatuses = input.required<BudgetStatus[]>();
  readonly categoryMap = input.required<Map<string, Category>>();

  readonly editBudget = output<BudgetStatus>();
  readonly deleteBudget = output<string>();

  getCategoryName(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.name ?? 'Unknown';
  }

  getCategoryIcon(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.icon ?? 'help';
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.color ?? '#999';
  }

  getProgressColor(percentage: number): 'primary' | 'accent' | 'warn' {
    if (percentage >= 80) {
      return 'warn';
    }
    if (percentage >= 50) {
      return 'accent';
    }
    return 'primary';
  }
}
