import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ from: vi.fn(), configured: true }));
vi.mock('./supabase', () => ({
  get supabase() { return mocks.configured ? { from: mocks.from } : null; },
}));
import { getProjects, getSponsors } from './content';

beforeEach(() => {
  mocks.configured = true;
  mocks.from.mockReset();
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
