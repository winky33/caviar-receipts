import { TestBed } from '@angular/core/testing';

import { App } from './app';

describe('App', () => {
  it('renders the receipt maker workspace', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Caviar Nail Gallery');
    expect(compiled.textContent).toContain('Download PNG');
  });
});
