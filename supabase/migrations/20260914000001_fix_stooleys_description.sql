-- Stooley's is a pub, not a club; the description was carried over verbatim
-- from the 2024 site. Only the seeded wording is replaced, so an edit someone
-- has made since survives.

update public.club_projects
set description = 'Website for a Kingston pub, letting customers view the menu and place orders.'
where name = 'Stooley''s Pub'
  and description = 'Website designed for local Kingston club allowing customers to view their menu and place orders.';
