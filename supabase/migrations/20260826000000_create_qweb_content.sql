create table public.club_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo text,
  created_at timestamptz not null default now()
);

alter table public.club_projects enable row level security;
alter table public.team_members enable row level security;

create policy "Published projects are publicly readable"
  on public.club_projects for select
  to anon, authenticated
  using (true);

create policy "Published team members are publicly readable"
  on public.team_members for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.club_projects from anon, authenticated;
revoke insert, update, delete on public.team_members from anon, authenticated;
