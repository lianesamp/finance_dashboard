import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionDialog } from './transaction-dialog';
import { Category } from '../../models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Salary', icon: 'payments', color: '#4CAF50' },
  { id: 'cat-2', name: 'Groceries', icon: 'shopping_cart', color: '#FF9800' },
];

describe('TransactionDialog', () => {
  function createComponent(data: { categories: Category[]; transaction?: unknown }) {
    TestBed.configureTestingModule({
      imports: [TransactionDialog],
      providers: [
        provideAnimationsAsync(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(TransactionDialog);
    fixture.detectChanges();
    return fixture;
  }

  it('should create the component', () => {
    const fixture = createComponent({ categories: MOCK_CATEGORIES });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with an empty form in add mode', () => {
    const fixture = createComponent({ categories: MOCK_CATEGORIES });
    const form = fixture.componentInstance.form;
    expect(form.get('description')?.value).toBe('');
    expect(form.get('amount')?.value).toBe(null);
    expect(form.get('type')?.value).toBe('expense');
    expect(form.get('categoryId')?.value).toBe('');
    expect(form.get('date')?.value).toBe('');
  });

  it('should populate form in edit mode', () => {
    const fixture = createComponent({
      categories: MOCK_CATEGORIES,
      transaction: {
        id: 'tx-1',
        description: 'Test',
        amount: 50,
        type: 'income' as const,
        categoryId: 'cat-1',
        date: '2026-11-01',
      },
    });
    const form = fixture.componentInstance.form;
    expect(form.get('description')?.value).toBe('Test');
    expect(form.get('amount')?.value).toBe(50);
    expect(form.get('type')?.value).toBe('income');
  });

  describe('validation', () => {
    it('should require description', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('description')!;
      control.markAsTouched();
      expect(control.hasError('required')).toBe(true);
    });

    it('should require amount', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('amount')!;
      control.markAsTouched();
      expect(control.hasError('required')).toBe(true);
    });

    it('should require amount > 0', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('amount')!;
      control.setValue(0);
      expect(control.hasError('min')).toBe(true);
      control.setValue(-5);
      expect(control.hasError('min')).toBe(true);
      control.setValue(0.01);
      expect(control.hasError('min')).toBe(false);
    });

    it('should require categoryId', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('categoryId')!;
      control.markAsTouched();
      expect(control.hasError('required')).toBe(true);
    });

    it('should require date', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('date')!;
      control.markAsTouched();
      expect(control.hasError('required')).toBe(true);
    });

    it('should reject a date in the future', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('date')!;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      control.setValue(tomorrow.toISOString().slice(0, 10));
      expect(control.hasError('futureDate')).toBe(true);
    });

    it('should accept today as a valid date', () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const control = fixture.componentInstance.form.get('date')!;
      control.setValue(new Date().toISOString().slice(0, 10));
      expect(control.hasError('futureDate')).toBe(false);
    });

    it('should show validation messages in the DOM when fields are touched', async () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      const form = fixture.componentInstance.form;

      // Touch all controls to trigger validation
      form.markAllAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const errors = compiled.querySelectorAll('mat-error');
      // Should have error messages for description, amount, categoryId, date
      expect(errors.length).toBeGreaterThanOrEqual(4);
    });

    it('should disable save button when form is invalid', async () => {
      const fixture = createComponent({ categories: MOCK_CATEGORIES });
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const saveButton = compiled.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
      expect(saveButton.disabled).toBe(true);
    });
  });
});
