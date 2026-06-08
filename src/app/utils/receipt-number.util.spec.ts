import { describe, expect, it } from 'vitest';

import { buildReceiptFileName, createReceiptNumber } from './receipt-number.util';

describe('receipt number util', () => {
  it('creates the default receipt number with zero padding', () => {
    expect(createReceiptNumber()).toBe('NO.0001');
  });

  it('creates padded receipt numbers for later sequences', () => {
    expect(createReceiptNumber(27)).toBe('NO.0027');
  });

  it('builds a download filename without punctuation from the receipt number', () => {
    const buildModeFileName = buildReceiptFileName as unknown as (
      receiptNumber: string,
      mode: 'item-list' | 'receipt',
    ) => string;

    expect(buildModeFileName('NO.0027', 'item-list')).toBe('receipt-NO0027-item-list.png');
  });

  it('builds a payment filename for receipt view exports', () => {
    const buildModeFileName = buildReceiptFileName as unknown as (
      receiptNumber: string,
      mode: 'item-list' | 'receipt',
    ) => string;

    expect(buildModeFileName('NO.0027', 'receipt')).toBe('receipt-NO0027-payment.png');
  });
});
