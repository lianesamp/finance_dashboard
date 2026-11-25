import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CurrencyPipe, MatCardModule, MatIconModule],
  selector: 'app-balance-cards',
  styleUrl: './balance-cards.scss',
  templateUrl: './balance-cards.html',
})
export class BalanceCards {
  readonly balance = input.required<number>();
  readonly totalIncome = input.required<number>();
  readonly totalExpenses = input.required<number>();
}
