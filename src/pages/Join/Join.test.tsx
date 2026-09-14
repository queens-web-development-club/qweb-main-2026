import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Join } from './Join';

beforeEach(() => {
  vi.stubGlobal('React', React);
});

describe('join', () => {
  it('links director applications to the form in a new tab', () => {
    const html = renderToStaticMarkup(<Join />);
    expect(html).toContain('href="https://forms.gle/F21U1EmAcFkuwXio8" target="_blank" rel="noreferrer"');
  });

  it('names every team a director can apply to lead', () => {
    const html = renderToStaticMarkup(<Join />);
    for (const team of ['Education', 'Development', 'Design', 'Outreach', 'Finance']) {
      expect(html).toContain(team);
    }
  });
});
