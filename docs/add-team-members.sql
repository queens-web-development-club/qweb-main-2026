-- Fill in the 2026-27 executive team, then paste into the Supabase SQL Editor.
--
-- Only add someone who has agreed to their name, photo, year, program and fun
-- fact being published and search-indexed. That consent is a launch gate, and
-- it is per person, not per club. Leave any column null rather than guessing:
-- a card renders correctly with nothing but a name and a role.
--
-- role must be exactly one of: 'Co-Chair', 'Development', 'Outreach', 'Design', 'Education'
--   (the 2024 site's titles like "Development Director" are not valid values —
--    map them to the closest of the five, the card shows the role you pick)
--
-- photo must be null, a path under public/ such as '/assets/Unknown_Member.jpg',
--   or an https:// URL. A database constraint rejects anything else, and a null
--   photo falls back to the placeholder portrait automatically.
--
-- Order on the page: co-chairs first, then everyone else, each group in the
-- order inserted here.

insert into public.team_members (name, role, year, program, responsibility, fun_fact, photo)
values
  -- ('Full Name',  'Co-Chair',    '3rd Year', 'Computing', 'What they run.', 'Something true.', null),
  -- ('Full Name',  'Co-Chair',    null,       null,        null,             null,              null),
  -- ('Full Name',  'Development', null,       null,        null,             null,              null),
  -- ('Full Name',  'Design',      null,       null,        null,             null,              null),
  -- ('Full Name',  'Outreach',    null,       null,        null,             null,              null),
  -- ('Full Name',  'Education',   null,       null,        null,             null,              null)
;

-- Check what landed:
--   select name, role, year, program from public.team_members order by created_at;
--
-- Remove someone who asked to be taken down:
--   delete from public.team_members where name = 'Full Name';
--
-- Portraits: upload to public/assets/ in the repo and reference '/assets/Name.jpg',
-- or put them in a Supabase bucket and use the public https URL. Strip EXIF and
-- GPS metadata before uploading either way.
