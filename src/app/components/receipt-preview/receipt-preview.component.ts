import { Component, computed, input } from '@angular/core';

import { PreviewMode } from '../../models/preview-mode.model';
import { ReceiptData } from '../../models/receipt.model';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-MY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

@Component({
  selector: 'app-receipt-preview',
  templateUrl: './receipt-preview.component.html',
  styleUrl: './receipt-preview.component.scss',
})
export class ReceiptPreviewComponent {
  readonly receiptData = input.required<ReceiptData>();
  readonly mode = input<PreviewMode>('item-list');

  protected readonly footerLines = computed(() =>
    this.receiptData()
      .footerMessage.split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  );
  protected readonly receiptFooterLine = computed(() => this.footerLines()[0] ?? 'THANK YOU');
  protected readonly totalQty = computed(() =>
    this.receiptData().items.reduce((sum, item) => sum + item.qty, 0),
  );
  protected readonly subtotal = computed(() =>
    this.receiptData().items.reduce((sum, item) => sum + item.amount, 0),
  );
  protected readonly total = computed(() => this.subtotal());

  protected formatCurrency(amount: number): string {
    return `RM${CURRENCY_FORMATTER.format(amount)}`;
  }

  protected formatAmountValue(amount: number): string {
    return CURRENCY_FORMATTER.format(amount);
  }
}
