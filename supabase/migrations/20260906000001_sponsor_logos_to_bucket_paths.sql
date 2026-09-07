-- sponsors.logo now holds an object name inside the sponsor-logos bucket
-- rather than a path served from the site's public/ directory. The frontend
-- builds the public URL through the storage client.
update public.sponsors
  set logo = regexp_replace(logo, '^/sponsors/', '')
  where logo like '/sponsors/%';

-- Restrict the column to a bare object name. This rejects a leading slash, any
-- scheme, and directory traversal, so a row cannot point the site's <img> tags
-- at an unapproved host. The constraint fails to apply if a row holds anything
-- else, which is the intended signal to review that row by hand.
alter table public.sponsors drop constraint if exists sponsors_logo_check;
alter table public.sponsors
  add constraint sponsors_logo_check check (logo ~ '^[A-Za-z0-9._-]+$');
