-- The 2026-27 executive team. Paste into the Supabase SQL Editor.
--
-- Run 20260907000001_open_up_team_roles.sql FIRST, or Aun's row is rejected:
-- the old constraint allowed only five hardcoded roles and 'Finance' is not
-- among them.
--
-- Only people who have agreed to their name and photo being published and
-- search-indexed belong here. Consent is per person and it is a launch gate.
--
-- photo is the object's file name inside the team-photos bucket, such as
-- 'Zac.jpeg'. The frontend resolves it to the bucket's public URL, so the
-- project reference never appears in a row. An asset path like
-- '/assets/Unknown_Member.jpg' or a full https URL also still works.
--
-- Alex and Che have no portrait in the bucket yet, so their photo stays null
-- and the card falls back to the placeholder rather than showing a broken
-- image. Fill them in with the UPDATE at the bottom once the files are up.
--
-- Six people: two co-chairs, then outreach, finance, development, education.

insert into public.team_members (name, role, photo)
values
  ('Zac',     'Co-Chair',    'Zac.jpeg'),
  ('Farhaan', 'Co-Chair',    'Farhaan.jpeg'),
  ('Griffin', 'Outreach',    'Griffin.jpeg'),
  ('Aun',     'Finance',     'Aun.jpeg'),
  ('Alex',    'Development', null),
  ('Che',     'Education',   null);

-- Once a missing portrait is uploaded to the team-photos bucket:
--
--   update public.team_members
--     set photo = 'Alex.jpeg'
--   where name = 'Alex';

-- Check what landed:
--   select name, role, photo is not null as has_photo from public.team_members order by created_at;
--
-- Someone asks to be removed:
--   delete from public.team_members where name = 'Zac';

-- Cards group by role: anything matching 'Co-Chair' (any casing) sits at the
-- top under "Co-chairs", everyone else appears under "Executives" in the order
-- inserted above. Year, program, responsibility and fun_fact are all optional
-- and can be filled in later without touching the site.
