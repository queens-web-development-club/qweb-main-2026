-- Aun stepped down as Finance executive (2026-10-19), so his card comes off the
-- team section. Finance is folded into Outreach for now; no replacement row.
-- Scoped to the seeded row so nobody else named Aun is touched.
-- His portrait (Aun.jpeg) stays in the team-photos bucket; remove it there by hand
-- if he asks.

delete from public.team_members
where name = 'Aun'
  and role = 'Finance';
