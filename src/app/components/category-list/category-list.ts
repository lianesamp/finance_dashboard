import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../models/category.model';

@Component({
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'app-category-list',
  styleUrl: './category-list.scss',
  templateUrl: './category-list.html',
})
export class CategoryList {
  readonly categories = input.required<Category[]>();

  readonly edit = output<Category>();
  readonly delete = output<string>();
}
