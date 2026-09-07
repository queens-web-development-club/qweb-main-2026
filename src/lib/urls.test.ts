import { describe, expect, it } from 'vitest';
import { safeImage, safeLink } from './urls';

describe('safeLink', () => {
  it('keeps an https destination', () => {
    expect(safeLink('https://qflip.ca/')).toBe('https://qflip.ca/');
  });

  it.each([
    ['javascript:alert(1)'],
    ['JavaScript:alert(1)'],
    ['  javascript:alert(1)'],
    ['data:text/html,<script>alert(1)</script>'],
    ['vbscript:msgbox(1)'],
    ['file:///etc/passwd'],
  ])('refuses the executable or local scheme %s', (value) => {
    expect(safeLink(value)).toBeNull();
  });

  it('refuses a protocol-relative destination that borrows the page scheme', () => {
    expect(safeLink('//evil.example.com/path')).toBeNull();
  });

  it.each([['http://qflip.ca'], ['qflip.ca'], ['/projects/qflip'], [''], ['   '], ['not a url']])(
    'refuses %s as a content destination', (value) => { expect(safeLink(value)).toBeNull(); });

  it.each([[null], [undefined], [42], [{}]])('refuses the non-string %s', (value) => {
    expect(safeLink(value)).toBeNull();
  });
});

describe('safeImage', () => {
  it('keeps a same-origin asset path', () => {
    expect(safeImage('/projects/qflip.jpg')).toBe('/projects/qflip.jpg');
  });

  it('keeps an https image host', () => {
    expect(safeImage('https://project.supabase.co/storage/v1/object/public/sponsor-logos/COMPSA.png'))
      .toBe('https://project.supabase.co/storage/v1/object/public/sponsor-logos/COMPSA.png');
  });

  it.each([
    ['//evil.example.com/tracker.gif'],
    ['data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='],
    ['javascript:alert(1)'],
    ['http://insecure.example.com/logo.png'],
    ['projects/qflip.jpg'],
    [''],
    [null],
  ])('refuses %s as an image source', (value) => {
    expect(safeImage(value)).toBeNull();
  });
});
