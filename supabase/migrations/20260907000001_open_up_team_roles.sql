-- The role column allowed exactly five values, so the 2026-27 team could not
-- record a Finance executive without a migration and a deploy. A club renames
-- and invents positions every year; that is the sort of change the database
-- exists to absorb, the same reason the schedule moved out of the repository.
--
-- The check becomes a shape rather than a list: present, not blank, and short
-- enough to fit a card. "Co-Chair" keeps its meaning in the frontend, which
-- matches it case-insensitively so a row typed "co-chair" still groups at the
-- top rather than silently landing among the executives.
alter table public.team_members drop constraint if exists team_members_role_check;
alter table public.team_members
  add constraint team_members_role_check
  check (length(trim(role)) between 1 and 40);
