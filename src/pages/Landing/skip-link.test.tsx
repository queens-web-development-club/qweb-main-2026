import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';

vi.mock('../../lib/supabase', () => ({ isSupabaseConfigured: false, supabase: null }));
import { Landing } from './Landing';

beforeEach(() => { vi.stubGlobal('React', React); });

it('lets a keyboard visitor bypass the navigation before it repeats on every load', () => {
  const html = renderToStaticMarkup(<Landing />);
  const skip = html.indexOf('class="skip-link"');
  expect(skip).toBeGreaterThan(-1);
  // It has to come before the navigation, or it bypasses nothing.
  expect(skip).toBeLessThan(html.indexOf('class="nav page-load"'));
  expect(html).toContain('href="#top"');
  // The target takes focus, so the next Tab continues from the content.
  expect(html).toMatch(/id="top"[^>]*tabindex="-1"|tabindex="-1"[^>]*id="top"/);
});
