/** Splits a roster into the two groups the team section renders separately. */
export function splitTeam<T extends { role: string }>(members: T[]) {
  return {
    chairs: members.filter((member) => member.role === 'Co-Chair'),
    executives: members.filter((member) => member.role !== 'Co-Chair'),
  };
}
