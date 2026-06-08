import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReceiptExportService } from '../../services/receipt-export.service';
import { ReceiptMakerComponent } from './receipt-maker.component';

describe('ReceiptMakerComponent', () => {
  const exportAsPng = vi.fn();

  beforeEach(async () => {
    exportAsPng.mockReset();
    exportAsPng.mockResolvedValue(undefined);

    await TestBed.configureTestingModule({
      imports: [ReceiptMakerComponent],
      providers: [
        {
          provide: ReceiptExportService,
          useValue: { exportAsPng },
        },
      ],
    }).compileComponents();
  });

  it('shows the default receipt workspace with one item row', async () => {
    const fixture = TestBed.createComponent(ReceiptMakerComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Caviar Nail Gallery');
    expect(compiled.textContent).toContain('NO.0001');
    expect(compiled.textContent).toContain('THANK YOU FOR YOUR PURCHASE');
    expect(compiled.textContent).toContain('Item List View');
    expect(compiled.textContent).toContain('Receipt View');
    expect(compiled.querySelectorAll('[data-testid="item-row"]')).toHaveLength(1);
  });

  it('adds and removes item rows from the form', async () => {
    const fixture = TestBed.createComponent(ReceiptMakerComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    fixture.componentInstance['handleAddItem']();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelectorAll('[data-testid="item-row"]')).toHaveLength(2);

    fixture.componentInstance['handleRemoveItem'](1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelectorAll('[data-testid="item-row"]')).toHaveLength(1);
  });

  it('updates the preview as the form changes', async () => {
    const fixture = TestBed.createComponent(ReceiptMakerComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const [dateInput, timeInput] = compiled.querySelectorAll<HTMLInputElement>(
      '[data-testid="receipt-date"], [data-testid="receipt-time"]',
    );
    const itemNameInput = compiled.querySelector<HTMLInputElement>('[data-testid="item-name"]');
    const itemQtyInput = compiled.querySelector<HTMLInputElement>('[data-testid="item-qty"]');
    const itemAmountInput = compiled.querySelector<HTMLInputElement>('[data-testid="item-amount"]');
    const footerMessageInput = compiled.querySelector<HTMLTextAreaElement>('[data-testid="footer-message"]');

    if (!dateInput || !timeInput || !itemNameInput || !itemQtyInput || !itemAmountInput || !footerMessageInput) {
      throw new Error('Expected receipt form inputs to be present.');
    }

    dateInput.value = '2026-06-06';
    dateInput.dispatchEvent(new Event('input'));
    timeInput.value = '21:21';
    timeInput.dispatchEvent(new Event('input'));
    itemNameInput.value = 'Anime Nail';
    itemNameInput.dispatchEvent(new Event('input'));
    itemQtyInput.value = '2';
    itemQtyInput.dispatchEvent(new Event('input'));
    itemAmountInput.value = '120';
    itemAmountInput.dispatchEvent(new Event('input'));
    footerMessageInput.value = 'THANK YOU\\nCOME AGAIN';
    footerMessageInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    const preview = compiled.querySelector('[data-testid="receipt-preview"]');

    expect(preview?.textContent).toContain('2026/06/06 (Sat) 21:21');
    expect(preview?.textContent).toContain('Anime Nail');
    expect(preview?.textContent).toContain('2');
    expect(preview?.textContent).toContain('COME AGAIN');
  });

  it('switches to receipt view and shows receipt totals', async () => {
    const fixture = TestBed.createComponent(ReceiptMakerComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const receiptModeButton = compiled.querySelector<HTMLButtonElement>('[data-testid="preview-mode-receipt"]');
    const itemAmountInput = compiled.querySelector<HTMLInputElement>('[data-testid="item-amount"]');

    if (!receiptModeButton || !itemAmountInput) {
      throw new Error('Expected preview mode toggle and amount input to be present.');
    }

    itemAmountInput.value = '140';
    itemAmountInput.dispatchEvent(new Event('input'));
    receiptModeButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Subtotal');
    expect(compiled.textContent).toContain('Total Qty');
    expect(compiled.textContent).toContain('RM140.00');
  });

  it('exports the receipt preview with a sanitized filename', async () => {
    const fixture = TestBed.createComponent(ReceiptMakerComponent);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const receiptNumberInput = compiled.querySelector<HTMLInputElement>('[data-testid="receipt-no"]');
    const receiptModeButton = compiled.querySelector<HTMLButtonElement>('[data-testid="preview-mode-receipt"]');
    const downloadButton = compiled.querySelector<HTMLButtonElement>('[data-testid="download-png"]');

    if (!receiptNumberInput || !receiptModeButton || !downloadButton) {
      throw new Error('Expected export controls to be present.');
    }

    receiptNumberInput.value = 'NO.0042';
    receiptNumberInput.dispatchEvent(new Event('input'));
    receiptModeButton.click();
    fixture.detectChanges();

    downloadButton.click();
    await fixture.whenStable();

    expect(exportAsPng).toHaveBeenCalledWith(expect.any(HTMLElement), 'receipt-NO0042-payment.png');
  });

  it('does not force the preview stage to overflow its card on mobile', () => {
    const styles = (ReceiptMakerComponent as unknown as { ɵcmp: { styles: string[] } }).ɵcmp.styles.join('\n');

    expect(styles).not.toContain('min-height: 100%');
  });
});
