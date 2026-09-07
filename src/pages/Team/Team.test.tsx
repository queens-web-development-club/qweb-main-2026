import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ items: [] as Record<string, unknown>[], isLoading: false, hasError: false }));
vi.mock('../../lib/useContentList', () => ({ useContentList: () => state }));
import { Team } from './Team';

beforeEach(() => {
  vi.stubGlobal('React', React);
  state.items = [];
  state.isLoading = false;
  state.hasError = false;
});

describe('team', () => {
  it('shows the role-only structure when the roster is unavailable', () => {
    state.hasError = true;
    const html = renderToStaticMarkup(<Team />);
    expect(html).toContain('Co-Chair');
    expect(html).toContain('Outreach');
  });

  it('shows the role-only structure when the table is empty', () => {
    const html = renderToStaticMarkup(<Team />);
    expect(html).toContain('Co-Chair');
  });

  it('renders the database roster instead of the structure once it loads', () => {
    state.items = [{ id: 'a', name: 'Real Person', role: 'Co-Chair', photo: null, year: null, program: null, responsibility: null, fun_fact: null }];
    const html = renderToStaticMarkup(<Team />);
    expect(html).toContain('Real Person');
    expect(html).not.toContain('>Co-chair<');
  });
});
