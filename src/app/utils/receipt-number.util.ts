import { PreviewMode } from '../models/preview-mode.model';

const DEFAULT_SEQUENCE = 1;
const PREFIX = 'NO.';

export function createReceiptNumber(sequence = DEFAULT_SEQUENCE): string {
  return `${PREFIX}${sequence.toString().padStart(4, '0')}`;
}

export function buildReceiptFileName(
  receiptNumber: string,
  mode: PreviewMode = 'item-list',
): string {
  const normalizedReceiptNumber = receiptNumber.replace(/[^a-z0-9]/gi, '');
  const modeSuffix = mode === 'receipt' ? 'payment' : 'item-list';
  return `receipt-${normalizedReceiptNumber}-${modeSuffix}.png`;
}
