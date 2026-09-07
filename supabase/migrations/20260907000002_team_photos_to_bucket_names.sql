-- Team portraits went in as full storage URLs, which bakes the project
-- reference into every row: move the Supabase project and all six rows break,
-- and the same photo is written six different ways depending on who typed it.
-- Sponsor logos already store a bare object name and let the storage client
-- build the URL. This makes the roster match.
--
-- Existing rows are rewritten rather than left in the old shape, so there is
-- one format in the table and not two.
update public.team_members
  set photo = regexp_replace(photo, '^https://[^/]+/storage/v1/object/public/team-photos/', '')
  where photo like '%/storage/v1/object/public/team-photos/%';

-- A bare object name is now valid alongside the asset paths and https URLs the
-- column already allowed: a portrait shipped in public/ and one hosted
-- elsewhere both still work, so nothing that was valid before is rejected now.
alter table public.team_members drop constraint if exists team_members_photo_check;
alter table public.team_members
  add constraint team_members_photo_check check (
    photo is null
    or photo ~ '^[A-Za-z0-9._-]+$'
    or photo ~ '^/[^/]'
    or photo ~ '^https://[^/\s]'
  );
