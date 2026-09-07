import { describe, expect, it } from 'vitest';
import { isLandingPath } from './route';

describe('isLandingPath', () => {
  it.each([
    ['/', '/'],
    ['', '/'],
    // A project Pages site is served from a subdirectory, so the club's
    // homepage is not "/" and must not be mistaken for an unknown path.
    ['/qweb-main-2026/', '/qweb-main-2026/'],
    ['/qweb-main-2026', '/qweb-main-2026/'],
    ['/qweb-main-2026/index.html', '/qweb-main-2026/'],
    ['/index.html', '/'],
  ])('treats %s as the landing page under base %s', (pathname, base) => {
    expect(isLandingPath(pathname, base)).toBe(true);
  });

  it.each([
    ['/about', '/'],
    ['/qweb-main-2026/about', '/qweb-main-2026/'],
    ['/other-repo/', '/qweb-main-2026/'],
    ['/qweb-main-2026-other/', '/qweb-main-2026/'],
  ])('treats %s as an unknown path under base %s', (pathname, base) => {
    expect(isLandingPath(pathname, base)).toBe(false);
  });
});
