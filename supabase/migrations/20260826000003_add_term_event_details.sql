alter table public.term_events
  add column if not exists event_time text,
  add column if not exists event_location text;
