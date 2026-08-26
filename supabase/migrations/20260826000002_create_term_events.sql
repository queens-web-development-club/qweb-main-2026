create table public.term_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  description text not null,
  event_date date not null,
  created_at timestamptz not null default now()
);

alter table public.term_events enable row level security;

create policy "Term events are publicly readable"
  on public.term_events for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.term_events from anon, authenticated;
