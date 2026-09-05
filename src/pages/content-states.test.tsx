import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ items: [] as Record<string, unknown>[], isLoading: false, hasError: false }));
vi.mock('../lib/useContentList', () => ({ useContentList: () => state }));
import { Projects } from './Projects/Projects';
import { Sponsors } from './Sponsors/Sponsors';

beforeEach(() => {
  vi.stubGlobal('React', React);
  state.items = [];
  state.isLoading = false;
  state.hasError = false;
});

describe.each([
  ['projects', Projects, 'project-card'],
  ['sponsors', Sponsors, 'sponsors__logos'],
] as const)('%s states', (name, Component, populatedClass) => {
  it('shows an empty state without seeded entries or empty navigation', () => {
    const html = renderToStaticMarkup(<Component />);
    expect(html).toContain(`No ${name} have been added yet.`);
    expect(html).not.toContain(populatedClass);
    expect(html).not.toContain('project-rail__foot');
  });

  it('announces loading without an empty or error message', () => {
    state.isLoading = true;
    const html = renderToStaticMarkup(<Component />);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain(`Loading ${name}...`);
    expect(html).not.toContain('have been added yet');
    expect(html).not.toContain('role="alert"');
  });

  it('reports unavailable data without treating it as an empty result', () => {
    state.hasError = true;
    const html = renderToStaticMarkup(<Component />);
    expect(html).toContain('role="alert"');
    expect(html).toContain('unavailable right now');
    expect(html).not.toContain('have been added yet');
    expect(html).not.toContain(populatedClass);
  });

  it('renders supplied database content', () => {
    state.items = [{ id: 'new', name: 'Database entry', description: 'New work', photo: '/projects/new.png', logo: '/sponsors/new.png', link: 'https://example.com' }];
    const html = renderToStaticMarkup(<Component />);
    expect(html).toContain('Database entry');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain(populatedClass);
    expect(html).not.toContain('have been added yet');
  });
});
