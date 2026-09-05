-- Keep database-managed projects, adding only legacy entries not already present.
alter table public.club_projects
  add column if not exists display_order integer not null default 1000;

-- Keep this seed safe to run on databases that have the base table but have not
-- applied the separate link-column migration yet.
alter table public.club_projects
  add column if not exists link text;

insert into public.club_projects (name, photo, description, link, display_order)
select seed.name, seed.photo, seed.description, seed.link, seed.display_order
from (values
  ('Biotech Leadership Consulting', '/projects/biotech-leadership.PNG', 'Website designed for a company providing leadership consulting on pharmaceutical projects.', null, 0),
  ('Queen''s Feminist Leadership in Politics', '/projects/qflip.jpg', 'Website designed for QFLIP, a Queen''s club focused on empowering women in the political realm.', 'https://qflip.ca/', 1),
  ('Stooley''s Pub', '/projects/stooleys.png', 'Website designed for local Kingston club allowing customers to view their menu and place orders.', null, 2),
  ('Mystic & Magic', '/projects/mystic-welcome.png', 'Website promoting a business selling various services and products relating to all things spiritual.', null, 3),
  ('Safe Dentistry', '/projects/safe-dentistry.PNG', 'Website designed for a company providing safe practice certifications for dental clinics.', null, 4),
  ('Torus Puzzle', '/projects/torus_home.png', 'A puzzle where the player has to form words across all three columns and rows.', null, 5),
  ('Sci Formal Hour Logger', '/projects/sci-formal-logger.PNG', 'Web app built for the Sci-Formal organizing committee to collect volunteer hours.', null, 6),
  ('Fiscal Fresh', '/projects/fiscal-fresh.png', 'A build that lets people save recipes and send the ingredients straight to their cart.', null, 7),
  ('Van the Man', '/projects/van-the-man.png', 'Portfolio designed for a local musician, with a guestbook and music integration.', null, 8),
  ('QVSA', '/projects/qvsa.png', 'Site for Queen''s Vietnamese Students'' Association, uniting students and faculty around Vietnamese tradition and culture.', null, 9),
  ('God''s Blood', '/projects/gods-blood.png', 'Storefront for a series of energy drinks, each flavour named for a member of the Greek pantheon.', null, 10)
) as seed(name, photo, description, link, display_order)
where not exists (
  select 1 from public.club_projects existing
  where lower(trim(existing.name)) = lower(trim(seed.name))
);
