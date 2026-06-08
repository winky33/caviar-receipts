import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ReceiptPreviewComponent } from './receipt-preview.component';

describe('ReceiptPreviewComponent', () => {
  it('uses a dedicated Ma Shan Zheng font hook for the Han labels in the preview', async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptPreviewComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReceiptPreviewComponent);

    fixture.componentRef.setInput('receiptData', {
      receiptNo: 'NO.0001',
      dateTime: '2026/06/08 (Mon) 11:38',
      items: [{ name: 'Anime Nail', qty: 1 }],
      footerMessage: 'THANK YOU',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const hanLabels = Array.from(compiled.querySelectorAll<HTMLElement>('.receipt-paper__han')).map(
      (element) => element.textContent?.trim(),
    );
    const styles = (ReceiptPreviewComponent as unknown as { ɵcmp: { styles: string[] } }).ɵcmp.styles.join('\n');

    expect(hanLabels).toEqual(['\u54c1\u5355', '\u54c1\u540d', '\u6570\u91cf']);
    expect(styles).toContain('.receipt-paper__han');
    expect(styles).toContain('"Ma Shan Zheng"');
  });
});
