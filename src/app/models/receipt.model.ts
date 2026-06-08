import { ReceiptItem } from './receipt-item.model';

export interface ReceiptData {
  receiptNo: string;
  dateTime: string;
  items: ReceiptItem[];
  footerMessage: string;
  discount?: number;
}
