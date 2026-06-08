import { Inject, Injectable, InjectionToken } from '@angular/core';
import * as html2canvasModule from 'html2canvas';

type Html2CanvasRenderer = (
  element: HTMLElement,
  options?: object,
) => Promise<HTMLCanvasElement>;

function resolveHtml2CanvasRenderer(): Html2CanvasRenderer {
  const renderElement =
    (html2canvasModule as { default?: Html2CanvasRenderer }).default ??
    (html2canvasModule as unknown as Html2CanvasRenderer);

  return renderElement;
}

export const HTML2CANVAS = new InjectionToken<Html2CanvasRenderer>('HTML2CANVAS', {
  providedIn: 'root',
  factory: resolveHtml2CanvasRenderer,
});

@Injectable({
  providedIn: 'root',
})
export class ReceiptExportService {
  constructor(@Inject(HTML2CANVAS) private readonly renderElement: Html2CanvasRenderer) {}

  async exportAsPng(element: HTMLElement, fileName: string): Promise<void> {
    const canvas = await this.renderElement(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    const blob = await this.canvasToBlob(canvas);
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.download = fileName;
    link.href = objectUrl;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }

  private canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('Could not create image blob.'));
      }, 'image/png');
    });
  }
}
