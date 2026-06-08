import { Component, input, output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReceiptItemTableComponent } from '../receipt-item-table/receipt-item-table.component';

@Component({
  selector: 'app-receipt-form',
  imports: [ReactiveFormsModule, ReceiptItemTableComponent],
  templateUrl: './receipt-form.component.html',
  styleUrl: './receipt-form.component.scss',
})
export class ReceiptFormComponent {
  readonly form = input.required<FormGroup>();
  readonly addItem = output<void>();
  readonly removeItem = output<number>();
  readonly download = output<void>();

  protected requestAddItem(): void {
    this.addItem.emit();
  }

  protected requestDownload(): void {
    this.download.emit();
  }

  protected requestRemoveItem(index: number): void {
    this.removeItem.emit(index);
  }

  protected itemGroups(): FormGroup[] {
    return [...((this.form().get('items') as FormArray<FormGroup>).controls as FormGroup[])];
  }
}
