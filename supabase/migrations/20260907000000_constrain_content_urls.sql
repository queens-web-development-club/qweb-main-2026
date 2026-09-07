-- src/lib/urls.ts already refuses a hostile link or image before it reaches the
-- DOM, but the frontend is not the only reader of these tables and a validator
-- can be bypassed by the next component that forgets to use one. These
-- constraints put the same rule where the data is, so a bad value cannot be
-- stored in the first place.
--
-- The rules match the frontend exactly: a link is absolute https, an image is
-- absolute https or a root-relative path, and a protocol-relative "//host" is
-- neither. Anything that fails is rejected at write time.

-- The sponsors link check predates this and allowed plain http, which the
-- frontend now drops. Tightening it here keeps the two from disagreeing; every
-- seeded sponsor link is already https, so no existing row is affected.
alter table public.sponsors drop constraint if exists sponsors_link_check;
alter table public.sponsors
  add constraint sponsors_link_check check (link ~ '^https://[^/\s]');

alter table public.club_projects drop constraint if exists club_projects_link_check;
alter table public.club_projects
  add constraint club_projects_link_check check (link is null or link ~ '^https://[^/\s]');

-- A screenshot is either shipped in public/ as /projects/... or hosted over
-- https. The second character must not be a slash, which is what rules out a
-- protocol-relative destination.
alter table public.club_projects drop constraint if exists club_projects_photo_check;
alter table public.club_projects
  add constraint club_projects_photo_check check (
    photo is null or photo ~ '^/[^/]' or photo ~ '^https://[^/\s]'
  );

alter table public.team_members drop constraint if exists team_members_photo_check;
alter table public.team_members
  add constraint team_members_photo_check check (
    photo is null or photo ~ '^/[^/]' or photo ~ '^https://[^/\s]'
  );
