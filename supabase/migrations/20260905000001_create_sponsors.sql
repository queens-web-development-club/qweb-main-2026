create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  logo text not null check (length(trim(logo)) > 0),
  link text not null check (link ~ '^https?://'),
  display_order integer not null default 1000,
  created_at timestamptz not null default now()
);

alter table public.sponsors enable row level security;

create policy "Sponsors are publicly readable"
  on public.sponsors for select
  to anon, authenticated
  using (true);

revoke all on public.sponsors from anon, authenticated;
grant select on public.sponsors to anon, authenticated;
grant all on public.sponsors to service_role;

insert into public.sponsors (name, logo, link, display_order) values
  ('COMPSA', '/sponsors/COMPSA.png', 'https://compsa.ca', 0),
  ('Queen''s Innovation Centre', '/sponsors/DDQIC.png', 'https://www.queensu.ca/innovationcentre', 1),
  ('Queen''s University', '/sponsors/Queens.png', 'https://www.queensu.ca', 2),
  ('GitHub', '/sponsors/Github.png', 'https://github.com', 3),
  ('Red Bull', '/sponsors/Redbull.png', 'https://www.redbull.com', 4);
