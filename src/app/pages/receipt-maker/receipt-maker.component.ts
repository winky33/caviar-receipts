import { CommonModule } from '@angular/common';
import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, startWith } from 'rxjs';

import { ReceiptFormComponent } from '../../components/receipt-form/receipt-form.component';
import { ReceiptPreviewComponent } from '../../components/receipt-preview/receipt-preview.component';
import { ReceiptItem } from '../../models/receipt-item.model';
import { ReceiptData } from '../../models/receipt.model';
import { ReceiptExportService } from '../../services/receipt-export.service';
import { buildReceiptFileName, createReceiptNumber } from '../../utils/receipt-number.util';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_FOOTER_MESSAGE = `THANK YOU FOR YOUR PURCHASE

TAG ME ON YOUR INSTAGRAM POST/STORY

TO GET A 5% OFF ON YOUR NEXT PURCHASE`;

type ReceiptItemFormGroup = FormGroup<{
  name: FormControl<string>;
  qty: FormControl<number>;
}>;

type ReceiptMakerForm = FormGroup<{
  receiptNo: FormControl<string>;
  date: FormControl<string>;
  time: FormControl<string>;
  footerMessage: FormControl<string>;
  items: FormArray<ReceiptItemFormGroup>;
}>;

type ReceiptMakerFormValue = {
  receiptNo: string;
  date: string;
  time: string;
  footerMessage: string;
  items: Array<ReceiptItem>;
};

@Component({
  selector: 'app-receipt-maker',
  imports: [CommonModule, ReactiveFormsModule, ReceiptFormComponent, ReceiptPreviewComponent],
  templateUrl: './receipt-maker.component.html',
  styleUrl: './receipt-maker.component.scss',
})
export class ReceiptMakerComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly exportService = inject(ReceiptExportService);

  protected readonly form: ReceiptMakerForm = this.formBuilder.nonNullable.group({
    receiptNo: this.formBuilder.nonNullable.control(createReceiptNumber(), [
      Validators.required,
      Validators.maxLength(20),
    ]),
    date: this.formBuilder.nonNullable.control(this.getCurrentDate()),
    time: this.formBuilder.nonNullable.control(this.getCurrentTime()),
    footerMessage: this.formBuilder.nonNullable.control(DEFAULT_FOOTER_MESSAGE),
    items: this.formBuilder.array([this.createItemGroup()]),
  });
  protected readonly receiptPreviewElement =
    viewChild.required<ElementRef<HTMLElement>>('receiptPreview');
  protected readonly receiptData = computed<ReceiptData>(() => this.buildReceiptData(this.formValue()));

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(
      map(() => this.form.getRawValue() as ReceiptMakerFormValue),
      startWith(this.form.getRawValue() as ReceiptMakerFormValue),
    ),
    {
      initialValue: this.form.getRawValue() as ReceiptMakerFormValue,
    },
  );

  protected handleAddItem(): void {
    this.form.controls.items.push(this.createItemGroup({ name: '', qty: 1 }));
  }

  protected handleRemoveItem(index: number): void {
    if (this.form.controls.items.length === 1) {
      return;
    }

    this.form.controls.items.removeAt(index);
  }

  protected async handleDownloadReceipt(): Promise<void> {
    await this.exportService.exportAsPng(
      this.receiptPreviewElement().nativeElement,
      buildReceiptFileName(this.form.controls.receiptNo.getRawValue()),
    );
  }

  private buildReceiptData(value: ReceiptMakerFormValue): ReceiptData {
    return {
      receiptNo: value.receiptNo.trim() || createReceiptNumber(),
      dateTime: this.formatReceiptDateTime(value.date, value.time),
      items: value.items
        .map((item) => ({
          name: item.name.trim(),
          qty: Number(item.qty) || 1,
        }))
        .filter((item) => item.name.length > 0),
      footerMessage: value.footerMessage.trim() || DEFAULT_FOOTER_MESSAGE,
    };
  }

  private createItemGroup(initialValue: Partial<ReceiptItem> = {}): ReceiptItemFormGroup {
    return this.formBuilder.nonNullable.group({
      name: this.formBuilder.nonNullable.control(initialValue.name ?? 'Anime Nail', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      qty: this.formBuilder.nonNullable.control(initialValue.qty ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  private formatReceiptDateTime(date: string, time: string): string {
    const [year = '', month = '', day = ''] = date.split('-');
    const weekdayIndex = new Date(`${date}T00:00:00`).getDay();
    const safeTime = time || '00:00';

    return `${year}/${month}/${day} (${WEEKDAYS[weekdayIndex]}) ${safeTime}`;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  }
}
