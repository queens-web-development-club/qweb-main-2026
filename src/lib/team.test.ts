import { describe, expect, it } from 'vitest';
import { splitTeam } from './team';

const members = [
  { id: '1', role: 'Co-Chair' },
  { id: '2', role: 'Development' },
  { id: '3', role: 'Co-Chair' },
  { id: '4', role: 'Design' },
];

describe('splitTeam', () => {
  it('separates co-chairs from executives', () => {
    const { chairs, executives } = splitTeam(members);
    expect(chairs.map((member) => member.id)).toEqual(['1', '3']);
    expect(executives.map((member) => member.id)).toEqual(['2', '4']);
  });

  it('preserves the incoming order within each group', () => {
    const { executives } = splitTeam(members);
    expect(executives[0].id).toBe('2');
  });

  it('handles an empty roster', () => {
    expect(splitTeam([])).toEqual({ chairs: [], executives: [] });
  });

  // Roles are free text so the club can add a position without a migration.
  // That makes casing and stray whitespace the one thing that could silently
  // drop a chair into the executives grid.
  it.each([['co-chair'], ['CO-CHAIR'], ['  Co-Chair  '], ['Co-chair']])(
    'still recognises %j as a co-chair', (role) => {
      expect(splitTeam([{ id: 'x', role }]).chairs.map((m) => m.id)).toEqual(['x']);
    });

  it('puts a position the club invented this year in the executives group', () => {
    const { chairs, executives } = splitTeam([{ id: 'a', role: 'Finance' }, { id: 'b', role: 'Sponsorship' }]);
    expect(chairs).toEqual([]);
    expect(executives.map((m) => m.id)).toEqual(['a', 'b']);
  });
});
