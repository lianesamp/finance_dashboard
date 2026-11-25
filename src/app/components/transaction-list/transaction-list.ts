import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

@Component({
  imports: [
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  selector: 'app-transaction-list',
  styleUrl: './transaction-list.scss',
  templateUrl: './transaction-list.html',
})
export class TransactionList {
  readonly transactions = input.required<Transaction[]>();
  readonly categoryMap = input.required<Map<string, Category>>();

  readonly edit = output<Transaction>();
  readonly delete = output<string>();

  readonly displayedColumns = [
    'date',
    'description',
    'category',
    'amount',
    'actions',
  ];

  getCategoryName(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.name ?? 'Unknown';
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.color ?? '#999';
  }

  getCategoryIcon(categoryId: string): string {
    return this.categoryMap().get(categoryId)?.icon ?? 'help';
  }
}
