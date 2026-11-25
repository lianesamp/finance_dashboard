import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

export interface TransactionDialogData {
  categories: Category[];
  transaction?: Transaction;
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  selector: 'app-transaction-dialog',
  styleUrl: './transaction-dialog.scss',
  templateUrl: './transaction-dialog.html',
})
export class TransactionDialog {
  private readonly dialogRef = inject(MatDialogRef<TransactionDialog>);
  protected readonly data = inject<TransactionDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.transaction;

  readonly form = new FormGroup({
    description: new FormControl<string>(
      this.data.transaction?.description ?? '',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    amount: new FormControl<number | null>(
      this.data.transaction?.amount ?? null,
      {
        validators: [Validators.required, Validators.min(0.01)],
      },
    ),
    type: new FormControl<'income' | 'expense'>(
      this.data.transaction?.type ?? 'expense',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    categoryId: new FormControl<string>(
      this.data.transaction?.categoryId ?? '',
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    date: new FormControl<string>(
      this.data.transaction?.date ?? '',
      {
        nonNullable: true,
        validators: [Validators.required, TransactionDialog.notFutureDate],
      },
    ),
  });

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const result: Omit<Transaction, 'id'> & { id?: string } = {
      description: formValue.description,
      amount: formValue.amount!,
      type: formValue.type,
      categoryId: formValue.categoryId,
      date: formValue.date,
    };

    if (this.data.transaction) {
      result.id = this.data.transaction.id;
    }

    this.dialogRef.close(result);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  private static notFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) {
      return null;
    }
    const today = new Date().toISOString().slice(0, 10);
    return value > today ? { futureDate: true } : null;
  }
}
