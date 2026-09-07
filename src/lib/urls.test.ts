import { describe, expect, it } from 'vitest';
import { assetUrl, safeImage, safeLink } from './urls';

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

describe('assetUrl', () => {
  it('leaves a root-relative path alone when the site is served from the domain root', () => {
    expect(assetUrl('/assets/logo.png', '/')).toBe('/assets/logo.png');
  });

  it('resolves a root-relative path against a subdirectory deployment', () => {
    expect(assetUrl('/assets/logo.png', '/qweb-main-2026/')).toBe('/qweb-main-2026/assets/logo.png');
  });

  it('does not double the base when it is already applied', () => {
    expect(assetUrl('/qweb-main-2026/assets/logo.png', '/qweb-main-2026/')).toBe('/qweb-main-2026/assets/logo.png');
  });

  it('leaves an absolute URL untouched', () => {
    expect(assetUrl('https://cdn.example.com/logo.png', '/qweb-main-2026/')).toBe('https://cdn.example.com/logo.png');
  });
});

describe('safeImage under a subdirectory deployment', () => {
  it('resolves a stored screenshot path against the base', () => {
    expect(safeImage('/projects/qflip.jpg', '/qweb-main-2026/')).toBe('/qweb-main-2026/projects/qflip.jpg');
  });

  it('still refuses a hostile value regardless of the base', () => {
    expect(safeImage('javascript:alert(1)', '/qweb-main-2026/')).toBeNull();
  });
});
