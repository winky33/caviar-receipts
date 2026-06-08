import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-receipt-item-table',
  imports: [ReactiveFormsModule],
  templateUrl: './receipt-item-table.component.html',
  styleUrl: './receipt-item-table.component.scss',
})
export class ReceiptItemTableComponent {
  readonly itemGroups = input.required<FormGroup[]>();
  readonly removeItem = output<number>();

  protected requestRemoveItem(index: number): void {
    this.removeItem.emit(index);
  }
}
