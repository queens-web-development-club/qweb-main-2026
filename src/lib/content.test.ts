import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), storageFrom: vi.fn(), configured: true }));
vi.mock('./supabase', () => ({
  get supabase() {
    return mocks.configured ? { from: mocks.from, storage: { from: mocks.storageFrom } } : null;
  },
}));
import { getProjects, getSponsors, getTeamMembers } from './content';

beforeEach(() => {
  mocks.configured = true;
  mocks.from.mockReset();
  mocks.storageFrom.mockReset();
  // Model storage returning the project's public object URL for a bucket path.
  mocks.storageFrom.mockImplementation((bucket: string) => ({
    getPublicUrl: (path: string) => ({
      data: { publicUrl: `https://project.supabase.co/storage/v1/object/public/${bucket}/${path}` },
    }),
  }));
});

describe('team content across profile schema versions', () => {
  function mockRoster(result: { data: unknown[] | null; error: unknown }) {
    const order = vi.fn().mockResolvedValue(result);
    // Model PostgREST rejecting named columns missing from the old schema.
    const select = vi.fn((fields: string) => ({
      order: fields === '*' ? order : vi.fn().mockResolvedValue({
        data: null, error: { code: '42703', message: 'column team_members.year does not exist' },
      }),
    }));
    mocks.from.mockReturnValue({ select });
    return { order };
  }

  it('loads a legacy roster and normalizes absent details to null', async () => {
    const member = { id: 'chair', name: 'Test chair', photo: null, role: 'Co-Chair' };
    const { order } = mockRoster({ data: [member], error: null });
    expect(await getTeamMembers()).toEqual({
      data: [{ ...member, year: null, program: null, responsibility: null, fun_fact: null }],
      error: null,
    });
    expect(mocks.from).toHaveBeenCalledWith('team_members');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: true });
  });

  it('preserves populated details and returns only the card fields', async () => {
    const member = {
      id: 'exec', name: 'Test exec', photo: '/assets/Unknown_Member.jpg', role: 'Design',
      year: 'Third year', program: 'Computing', responsibility: 'Design workshops', fun_fact: 'Plays piano',
    };
    mockRoster({ data: [{ ...member, created_at: '2026-09-05T00:00:00Z' }], error: null });
    expect(await getTeamMembers()).toEqual({ data: [member], error: null });
  });

  it.each([
    { data: [], error: null },
    { data: null, error: { code: '42501', message: 'Permission denied' } },
  ])('preserves empty results and real errors: %j', async (result) => {
    mockRoster(result);
    expect(await getTeamMembers()).toEqual(result);
  });

  it('reports missing configuration without requesting data', async () => {
    mocks.configured = false;
    const result = await getTeamMembers();
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(mocks.from).not.toHaveBeenCalled();
  });
});

describe('sponsor logos stored in the bucket', () => {
  function mockSponsors(rows: unknown[]) {
    const tieOrder = vi.fn().mockResolvedValue({ data: rows, error: null });
    const order = vi.fn().mockReturnValue({ order: tieOrder });
    mocks.from.mockReturnValue({ select: vi.fn().mockReturnValue({ order }) });
  }

  it('resolves a bucket object name to its public URL', async () => {
    mockSponsors([{ id: 'compsa', name: 'COMPSA', logo: 'COMPSA.png', link: 'https://compsa.ca' }]);
    const result = await getSponsors();
    expect(result.data).toEqual([{
      id: 'compsa',
      name: 'COMPSA',
      logo: 'https://project.supabase.co/storage/v1/object/public/sponsor-logos/COMPSA.png',
      link: 'https://compsa.ca',
    }]);
    expect(mocks.storageFrom).toHaveBeenCalledWith('sponsor-logos');
  });

  it('leaves a row carrying no logo untouched', async () => {
    const sponsor = { id: 'compsa', name: 'COMPSA', link: 'https://compsa.ca' };
    mockSponsors([sponsor]);
    const result = await getSponsors();
    expect(result.data).toEqual([sponsor]);
    expect(mocks.storageFrom).not.toHaveBeenCalled();
  });
});

describe.each([
  ['projects', getProjects, 'club_projects', 'id, name, photo, description, link'],
  ['sponsors', getSponsors, 'sponsors', 'id, name, logo, link'],
] as const)('%s content', (_name, load, table, fields) => {
  it('reports missing configuration without requesting data', async () => {
    mocks.configured = false;
    const result = await load();
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it.each([
    { data: [], error: null },
    { data: null, error: { message: 'Permission denied' } },
    { data: [{ id: 'database-record', name: 'New database content' }], error: null },
  ])('preserves the database result and requests stable display ordering: %j', async (result) => {
    const tieOrder = vi.fn().mockResolvedValue(result);
    const order = vi.fn().mockReturnValue({ order: tieOrder });
    const select = vi.fn().mockReturnValue({ order });
    mocks.from.mockReturnValue({ select });

    expect(await load()).toEqual(result);
    expect(mocks.from).toHaveBeenCalledWith(table);
    expect(select).toHaveBeenCalledWith(fields);
    expect(order).toHaveBeenCalledWith('display_order', { ascending: true });
    expect(tieOrder).toHaveBeenCalledWith('id', { ascending: true });
  });
});
