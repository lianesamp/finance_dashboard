import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../models/category.model';

export interface CategoryDialogData {
  category?: Category;
}

// Common Material icons useful for finance categories
export const AVAILABLE_ICONS = [
  'payments', 'shopping_cart', 'home', 'directions_bus', 'movie',
  'bolt', 'laptop', 'restaurant', 'health_and_safety', 'school',
  'fitness_center', 'pets', 'checkroom', 'savings', 'redeem',
  'local_grocery_store', 'flight', 'phone_android', 'build', 'brush',
];

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'app-category-dialog',
  styleUrl: './category-dialog.scss',
  templateUrl: './category-dialog.html',
})
export class CategoryDialog {
  private readonly dialogRef = inject(MatDialogRef<CategoryDialog>);
  protected readonly data = inject<CategoryDialogData>(MAT_DIALOG_DATA);

  protected readonly isEdit = !!this.data.category;
  protected readonly availableIcons = AVAILABLE_ICONS;

  readonly form = new FormGroup({
    name: new FormControl<string>(
      this.data.category?.name ?? '',
      { nonNullable: true, validators: [Validators.required] },
    ),
    icon: new FormControl<string>(
      this.data.category?.icon ?? 'payments',
      { nonNullable: true, validators: [Validators.required] },
    ),
    color: new FormControl<string>(
      this.data.category?.color ?? '#4CAF50',
      { nonNullable: true, validators: [Validators.required] },
    ),
  });

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const result: Omit<Category, 'id'> & { id?: string } = {
      name: formValue.name,
      icon: formValue.icon,
      color: formValue.color,
    };

    if (this.data.category) {
      result.id = this.data.category.id;
    }

    this.dialogRef.close(result);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected selectIcon(icon: string): void {
    this.form.get('icon')!.setValue(icon);
  }
}
