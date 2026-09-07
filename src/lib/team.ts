/**
 * Splits a roster into the two groups the team section renders separately.
 *
 * Roles are free text, because a student club invents a position faster than
 * anyone ships a migration. Only "Co-Chair" carries meaning here, so it is
 * matched forgivingly: a row typed as "co-chair" still belongs at the top.
 */
const isChair = (role: string) => role.trim().toLowerCase() === 'co-chair';

export function splitTeam<T extends { role: string }>(members: T[]) {
  return {
    chairs: members.filter((member) => isChair(member.role)),
    executives: members.filter((member) => !isChair(member.role)),
  };
}
