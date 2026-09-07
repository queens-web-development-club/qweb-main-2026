import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurriculumTicker } from './CurriculumTicker';

beforeEach(() => { vi.stubGlobal('React', React); });

describe('curriculum ticker', () => {
  it('lists the curriculum', () => {
    const html = renderToStaticMarkup(<CurriculumTicker skills={['HTML', 'CSS']} />);
    expect(html).toContain('HTML');
    expect(html).toContain('CSS');
  });

  it('offers an operable control to stop the motion, not hover alone', () => {
    const html = renderToStaticMarkup(<CurriculumTicker skills={['HTML']} />);
    expect(html).toContain('<button');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('Pause');
    expect(html).toContain('data-paused="false"');
  });

  it('stops the motion and offers to resume it once paused', () => {
    const html = renderToStaticMarkup(<CurriculumTicker skills={['HTML']} startPaused />);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('Play');
    expect(html).toContain('data-paused="true"');
  });
});
