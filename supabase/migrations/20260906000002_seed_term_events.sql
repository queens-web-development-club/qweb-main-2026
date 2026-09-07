-- The 2026-27 weekly workshop series moves out of the repository so the club
-- can change a date without a deploy. Thursdays from 17 September in
-- Kinesiology Room 100, teaching a portfolio site over weeks 1-5 and a club
-- site through week 10.
--
-- Times stay null until they are confirmed; the Term section renders "Time to
-- be announced" rather than a time nobody has agreed to.
--
-- An event name already in the table is left untouched, so re-running this
-- never overwrites a date the club has since moved.
insert into public.term_events (event_name, description, event_date, event_time, event_location)
select seed.event_name, seed.description, seed.event_date, seed.event_time, seed.event_location
from (values
  ('Kickoff + tools setup', 'Get set up properly: VS Code, GitHub, terminal basics, and your first HTML page.', date '2026-09-17', null::text, 'Kinesiology Building, Room 100'),
  ('CSS + Flexbox', 'Style your homepage and make it responsive — box model, hover states, media queries, Tailwind against plain CSS.', date '2026-09-24', null, 'Kinesiology Building, Room 100'),
  ('JavaScript + the DOM', 'Add interactivity: functions, event listeners, and changing the page as people use it.', date '2026-10-01', null, 'Kinesiology Building, Room 100'),
  ('Git + GitHub', 'Version control like a developer — commits, .gitignore, and pushing a repo you can share.', date '2026-10-08', null, 'Kinesiology Building, Room 100'),
  ('React & Vite', 'Rebuild your homepage out of components in a real Vite project.', date '2026-10-15', null, 'Kinesiology Building, Room 100'),
  ('Routing, components & styling', 'Structure an app across pages with a shared header, footer, and layout.', date '2026-10-22', null, 'Kinesiology Building, Room 100'),
  ('APIs + fetching data', 'Make the site dynamic: fetch, useEffect, and working with JSON.', date '2026-10-29', null, 'Kinesiology Building, Room 100'),
  ('Backend integration', 'What a backend actually is, and moving your fetch over to Express.', date '2026-11-05', null, 'Kinesiology Building, Room 100'),
  ('Database integration', 'Add a form and store what people submit, using Supabase.', date '2026-11-12', null, 'Kinesiology Building, Room 100'),
  ('Deployment + final polish', 'Deploy live on Vercel, handle environment variables, and polish the thing.', date '2026-11-19', null, 'Kinesiology Building, Room 100'),
  ('Demo night', 'Everyone presents what they built, plus where to go next.', date '2026-11-26', null, 'Kinesiology Building, Room 100')
) as seed(event_name, description, event_date, event_time, event_location)
where not exists (
  select 1 from public.term_events existing
  where lower(trim(existing.event_name)) = lower(trim(seed.event_name))
);
