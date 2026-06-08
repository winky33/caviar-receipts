import { Component, computed, input } from '@angular/core';

import { ReceiptData } from '../../models/receipt.model';

@Component({
  selector: 'app-receipt-preview',
  templateUrl: './receipt-preview.component.html',
  styleUrl: './receipt-preview.component.scss',
})
export class ReceiptPreviewComponent {
  readonly receiptData = input.required<ReceiptData>();

  protected readonly footerLines = computed(() =>
    this.receiptData()
      .footerMessage.split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
  );
}
