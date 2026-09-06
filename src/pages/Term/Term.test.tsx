import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ configured: false }));
vi.mock('../../lib/supabase', () => ({
  get isSupabaseConfigured() { return mocks.configured; },
  supabase: null,
}));
import { Term } from './Term';

beforeEach(() => {
  vi.stubGlobal('React', React);
  mocks.configured = false;
});

describe('term schedule without a database', () => {
  // The schedule lived in two places, and the copy in the repository won
  // whenever the table was empty. A term with no rows is now reported as such
  // rather than answered with dates nobody has confirmed.
  it('reports an unscheduled term instead of a schedule held in the repository', () => {
    const html = renderToStaticMarkup(<Term />);
    expect(html).toContain('No events have been scheduled yet.');
    expect(html).not.toContain('Kinesiology');
  });
});
