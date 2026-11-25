import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../services/transactions';
import { CategoriesService } from '../../services/categories';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { TransactionDialog, TransactionDialogData } from '../../components/transaction-dialog/transaction-dialog';
import { Transaction } from '../../models/transaction.model';

@Component({
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TransactionList,
  ],
  selector: 'app-transactions',
  styleUrl: './transactions.scss',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit {
  protected readonly transactionsService = inject(TransactionsService);
  protected readonly categoriesService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  // RxJS Subject for debounced search input
  private readonly searchSubject = new Subject<string>();

  // Available months derived from all transactions
  protected readonly availableMonths = signal<string[]>([]);

  constructor() {
    // Bridge RxJS → Service: debounce the search input, then update the service signal
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.transactionsService.setSearchText(value);
      });
  }

  ngOnInit(): void {
    this.buildAvailableMonths();
  }

  protected onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  protected onMonthChange(month: string): void {
    this.transactionsService.setSelectedMonth(month);
  }

  protected onCategoryChange(categoryId: string): void {
    this.transactionsService.setSelectedCategoryId(categoryId || null);
  }

  protected onSortChange(column: 'date' | 'amount'): void {
    if (this.transactionsService.sortBy() === column) {
      this.transactionsService.setSortDirection(
        this.transactionsService.sortDirection() === 'asc' ? 'desc' : 'asc',
      );
    } else {
      this.transactionsService.setSortBy(column);
      this.transactionsService.setSortDirection('desc');
    }
  }

  protected onEdit(transaction: Transaction): void {
    this.openDialog(transaction);
  }

  protected onDelete(id: string): void {
    this.transactionsService.deleteTransaction(id);
  }

  protected onAdd(): void {
    this.openDialog();
  }

  private openDialog(transaction?: Transaction): void {
    const data: TransactionDialogData = {
      categories: this.categoriesService.categories(),
      transaction,
    };

    const dialogRef = this.dialog.open(TransactionDialog, {
      data,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: Transaction | undefined) => {
      if (!result) {
        return;
      }
      if (result.id) {
        this.transactionsService.updateTransaction(result as Transaction);
      } else {
        this.transactionsService.addTransaction(result);
      }
      this.buildAvailableMonths();
    });
  }

  private buildAvailableMonths(): void {
    const months = new Set<string>();
    for (const tx of this.transactionsService.transactions()) {
      months.add(tx.date.slice(0, 7));
    }
    this.availableMonths.set([...months].sort().reverse());
  }
}
