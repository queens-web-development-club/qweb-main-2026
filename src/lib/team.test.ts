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
});
