import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../services/categories';
import { CategoryList } from '../../components/category-list/category-list';
import { CategoryDialog, CategoryDialogData } from '../../components/category-dialog/category-dialog';
import { Category } from '../../models/category.model';

@Component({
  imports: [MatButtonModule, MatIconModule, CategoryList],
  selector: 'app-categories',
  styleUrl: './categories.scss',
  templateUrl: './categories.html',
})
export class Categories {
  protected readonly categoriesService = inject(CategoriesService);
  private readonly dialog = inject(MatDialog);

  protected onEdit(category: Category): void {
    this.openDialog(category);
  }

  protected onDelete(id: string): void {
    this.categoriesService.deleteCategory(id);
  }

  protected onAdd(): void {
    this.openDialog();
  }

  private openDialog(category?: Category): void {
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
}
