import { Component } from '@angular/core';

import { ReceiptMakerComponent } from './pages/receipt-maker/receipt-maker.component';

@Component({
  selector: 'app-root',
  imports: [ReceiptMakerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
