import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories';
import { Category } from '../models/category.model';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial mock categories', () => {
    const categories = service.categories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should find a category by id', () => {
    const categories = service.categories();
    const first = categories[0];
    const found = service.getCategoryById(first.id);
    expect(found).toEqual(first);
  });

  it('should return undefined for unknown category id', () => {
    expect(service.getCategoryById('nonexistent')).toBeUndefined();
  });

  it('should add a new category', () => {
    const before = service.categories().length;
    const newCat: Omit<Category, 'id'> = {
      name: 'Health',
      icon: 'health_and_safety',
      color: '#00BCD4',
    };
    service.addCategory(newCat);
    expect(service.categories().length).toBe(before + 1);
    const added = service.categories().find((c) => c.name === 'Health');
    expect(added).toBeDefined();
    expect(added!.icon).toBe('health_and_safety');
  });

  it('should update an existing category', () => {
    const first = service.categories()[0];
    service.updateCategory({ ...first, name: 'Updated Name' });
    const updated = service.getCategoryById(first.id);
    expect(updated!.name).toBe('Updated Name');
  });

  it('should delete a category', () => {
    const first = service.categories()[0];
    const before = service.categories().length;
    service.deleteCategory(first.id);
    expect(service.categories().length).toBe(before - 1);
    expect(service.getCategoryById(first.id)).toBeUndefined();
  });
});
