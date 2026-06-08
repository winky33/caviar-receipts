import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HTML2CANVAS, ReceiptExportService } from './receipt-export.service';

const html2canvasMock = vi.fn();

describe('ReceiptExportService', () => {
  let service: ReceiptExportService;

  beforeEach(() => {
    html2canvasMock.mockReset();

    TestBed.configureTestingModule({
      providers: [
        ReceiptExportService,
        {
          provide: HTML2CANVAS,
          useValue: html2canvasMock,
        },
      ],
    });

    service = TestBed.inject(ReceiptExportService);
  });

  it('renders the receipt element and downloads it as a png file', async () => {
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const element = document.createElement('section');
    const canvas = document.createElement('canvas');
    const createObjectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:test-url');
    const revokeObjectUrlSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    canvas.toBlob = ((callback: BlobCallback) => {
      callback(new Blob(['png-data'], { type: 'image/png' }));
    }) as HTMLCanvasElement['toBlob'];

    html2canvasMock.mockResolvedValue(canvas);

    await service.exportAsPng(element, 'receipt-NO0001.png');

    expect(html2canvasMock).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        backgroundColor: '#ffffff',
        scale: 2,
      }),
    );
    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:test-url');

    clickSpy.mockRestore();
    createObjectUrlSpy.mockRestore();
    revokeObjectUrlSpy.mockRestore();
  });
});
