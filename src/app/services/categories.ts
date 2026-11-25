import { computed, Service, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES } from '../mock-data/mock-data';

@Service()
export class CategoriesService {
  private readonly _categories = signal<Category[]>(structuredClone(MOCK_CATEGORIES));

  readonly categories = this._categories.asReadonly();

  readonly categoryMap = computed(() => {
    const map = new Map<string, Category>();
    for (const cat of this._categories()) {
      map.set(cat.id, cat);
    }
    return map;
  });

  getCategoryById(id: string): Category | undefined {
    return this.categoryMap().get(id);
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    this._categories.update((cats) => [...cats, newCategory]);
  }

  updateCategory(category: Category): void {
    this._categories.update((cats) =>
      cats.map((c) => (c.id === category.id ? category : c)),
    );
  }

  deleteCategory(id: string): void {
    this._categories.update((cats) => cats.filter((c) => c.id !== id));
  }
}
