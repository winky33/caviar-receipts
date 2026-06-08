import { Component, input, output } from '@angular/core';

import { PreviewMode } from '../../models/preview-mode.model';

@Component({
  selector: 'app-preview-mode-toggle',
  templateUrl: './preview-mode-toggle.component.html',
  styleUrl: './preview-mode-toggle.component.scss',
})
export class PreviewModeToggleComponent {
  readonly mode = input<PreviewMode>('item-list');
  readonly modeChange = output<PreviewMode>();

  protected selectMode(mode: PreviewMode): void {
    if (this.mode() === mode) {
      return;
    }

    this.modeChange.emit(mode);
  }
}
