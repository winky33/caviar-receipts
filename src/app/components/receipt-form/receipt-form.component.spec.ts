import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { ReceiptFormComponent } from './receipt-form.component';

describe('ReceiptFormComponent', () => {
  it('wraps temporal inputs in a Safari-safe control shell', async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptFormComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReceiptFormComponent);

    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        receiptNo: new FormControl('NO.0001', { nonNullable: true }),
        date: new FormControl('2026-06-08', { nonNullable: true }),
        time: new FormControl('13:03', { nonNullable: true }),
        footerMessage: new FormControl('THANK YOU', { nonNullable: true }),
        items: new FormArray([
          new FormGroup({
            name: new FormControl('Anime Nail', { nonNullable: true }),
            qty: new FormControl(1, { nonNullable: true }),
          }),
        ]),
      }),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const dateInput = compiled.querySelector<HTMLInputElement>('[data-testid="receipt-date"]');
    const timeInput = compiled.querySelector<HTMLInputElement>('[data-testid="receipt-time"]');
    const styles = (
      ReceiptFormComponent as unknown as Record<string, { styles: string[] }>
    )['\u0275cmp'].styles.join('\n');

    expect(dateInput?.closest('.field__control')).not.toBeNull();
    expect(timeInput?.closest('.field__control')).not.toBeNull();
    expect(styles).toContain('.field__control');
    expect(styles).toContain('input[type=date]');
    expect(styles).toContain('input[type=time]');
    expect(styles).toContain('padding: 0;');
    expect(styles).toContain('min-width: 0;');
  });
});
