-- Ensure project records can store their ordering and optional live-site link.
-- This also repairs databases where the seed migration was applied manually.
alter table public.club_projects
  add column if not exists display_order integer not null default 1000;

alter table public.club_projects
  add column if not exists link text;
