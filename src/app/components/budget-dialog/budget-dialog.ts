import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Budget } from '../../models/budget.model';
import { Category } from '../../models/category.model';

export interface BudgetDialogData {
  categories: Category[];
  month: string;
  budget?: Budget;
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
  ],
  selector: 'app-budget-dialog',
  styleUrl: './budget-dialog.scss',
  templateUrl: './budget-dialog.html',
})
export class BudgetDialog {
  private readonly dialogRef = inject(MatDialogRef<BudgetDialog>);
  protected readonly data = inject<BudgetDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.budget;

  readonly form = new FormGroup({
    categoryId: new FormControl<string>(
      this.data.budget?.categoryId ?? '',
      { nonNullable: true, validators: [Validators.required] },
    ),
    limit: new FormControl<number | null>(
      this.data.budget?.limit ?? null,
      { validators: [Validators.required, Validators.min(1)] },
    ),
  });

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const result: Omit<Budget, 'id'> & { id?: string } = {
      categoryId: formValue.categoryId,
      limit: formValue.limit!,
      month: this.data.month,
    };

    if (this.data.budget) {
      result.id = this.data.budget.id;
    }

    this.dialogRef.close(result);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
