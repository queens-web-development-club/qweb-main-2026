-- The Fall 2026 schedule was remade before the term began: ten sessions rather
-- than eleven, one personal portfolio running the whole term instead of a
-- portfolio followed by a club site, and a Next.js and Vercel stack in place of
-- the Express and Supabase weeks. Times are confirmed, so the schedule no
-- longer answers "Time to be announced".
--
-- 20260906000002 seeded the superseded curriculum and has already been applied,
-- so this migration corrects forward instead of editing that file. It removes
-- only rows still carrying the names that seed inserted; a session someone has
-- since renamed survives and needs a look by hand.
delete from public.term_events
where event_name in (
  'Kickoff + tools setup',
  'CSS + Flexbox',
  'JavaScript + the DOM',
  'Git + GitHub',
  'React & Vite',
  'Routing, components & styling',
  'APIs + fetching data',
  'Backend integration',
  'Database integration',
  'Deployment + final polish',
  'Demo night'
);

insert into public.term_events (event_name, description, event_date, event_time, event_location)
select seed.event_name, seed.description, seed.event_date, seed.event_time, seed.event_location
from (values
  ('Build and deploy a site with AI', 'Every member leaves with a live website, built and deployed with an AI one shot tool.', date '2026-09-17', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Setting up your environment', 'Set up a proper workspace and build one section of the page you fully understand.', date '2026-09-24', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Building the full page structure', 'Rebuild the generated site by hand, section by section, and understand each part.', date '2026-10-01', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Styling the page', 'Apply a visual direction of your own and improve on the AI version.', date '2026-10-08', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Adding interactivity', 'Add working interactivity with JavaScript and the DOM, and understand the code behind it.', date '2026-10-15', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Version control and deployment', 'Put the site online under your own control with Git, GitHub, and your own link.', date '2026-10-22', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Introduction to React and Next.js', 'Understand why frameworks exist, and set up the modern stack.', date '2026-10-29', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Rebuilding in Next.js', 'Rebuild the portfolio as components and deploy the new version to Vercel.', date '2026-11-05', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Polish and functionality', 'Make the site look professional with Tailwind, animation, and a working contact form.', date '2026-11-12', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100'),
  ('Final review and presentations', 'Finish the site, present it, and leave with a live portfolio you built and understand.', date '2026-11-19', '6:00 to 7:00 pm', 'Kinesiology Building, Room 100')
) as seed(event_name, description, event_date, event_time, event_location)
where not exists (
  select 1 from public.term_events existing
  where lower(trim(existing.event_name)) = lower(trim(seed.event_name))
);
