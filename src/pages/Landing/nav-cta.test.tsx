import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';

vi.mock('../../lib/supabase', () => ({ isSupabaseConfigured: false, supabase: null }));
import { Landing } from './Landing';

beforeEach(() => { vi.stubGlobal('React', React); });

it('opens the application form in a new tab from the Join QWEB button', () => {
  const html = renderToStaticMarkup(<Landing />);
  const cta = html.match(/<a class="nav-cta"[^>]*>Join QWEB<\/a>/);
  expect(cta).not.toBeNull();
  expect(cta![0]).toContain('href="https://forms.gle/F21U1EmAcFkuwXio8"');
  expect(cta![0]).toContain('target="_blank"');
  expect(cta![0]).toContain('rel="noreferrer"');
});
