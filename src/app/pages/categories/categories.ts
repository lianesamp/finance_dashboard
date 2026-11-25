import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../services/categories';
import { BudgetsService, BudgetStatus } from '../../services/budgets';
import { TransactionsService } from '../../services/transactions';
import { CategoryList } from '../../components/category-list/category-list';
import { CategoryDialog, CategoryDialogData } from '../../components/category-dialog/category-dialog';
import { BudgetList } from '../../components/budget-list/budget-list';
import { BudgetDialog, BudgetDialogData } from '../../components/budget-dialog/budget-dialog';
import { Category } from '../../models/category.model';
import { Budget } from '../../models/budget.model';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CategoryList,
    BudgetList,
  ],
  selector: 'app-categories',
  styleUrl: './categories.scss',
  templateUrl: './categories.html',
})
export class Categories {
  protected readonly categoriesService = inject(CategoriesService);
  protected readonly budgetsService = inject(BudgetsService);
  protected readonly transactionsService = inject(TransactionsService);
  private readonly dialog = inject(MatDialog);

  protected onEditCategory(category: Category): void {
    this.openCategoryDialog(category);
  }

  protected onDeleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id);
  }

  protected onAddCategory(): void {
    this.openCategoryDialog();
  }

  protected onAddBudget(): void {
    this.openBudgetDialog();
  }

  protected onEditBudget(status: BudgetStatus): void {
    this.openBudgetDialog(status.budget);
  }

  protected onDeleteBudget(id: string): void {
    this.budgetsService.deleteBudget(id);
  }

  private openCategoryDialog(category?: Category): void {
    const data: CategoryDialogData = { category };

    const dialogRef = this.dialog.open(CategoryDialog, {
      data,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: Category | undefined) => {
      if (!result) {
        return;
      }
      if (result.id) {
        this.categoriesService.updateCategory(result as Category);
      } else {
        this.categoriesService.addCategory(result);
      }
    });
  }

  private openBudgetDialog(budget?: Budget): void {
    const data: BudgetDialogData = {
      categories: this.categoriesService.categories(),
      month: this.transactionsService.selectedMonth(),
      budget,
    };

    const dialogRef = this.dialog.open(BudgetDialog, {
      data,
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: Budget | undefined) => {
      if (!result) {
        return;
      }
      if (result.id) {
        this.budgetsService.updateBudget(result as Budget);
      } else {
        this.budgetsService.addBudget(result);
      }
    });
  }
}
