-- Sponsor logos move out of the repository's public/ directory and into
-- storage, so a logo can be replaced without a site deploy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sponsor-logos',
  'sponsor-logos',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Read access is public because these logos are published on the site. No
-- insert, update, or delete policy exists, so writes remain limited to
-- service_role, which bypasses row-level security. Adding a write policy for
-- anon or authenticated would let any visitor replace a sponsor's logo.
drop policy if exists "Sponsor logos are publicly readable" on storage.objects;
create policy "Sponsor logos are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sponsor-logos');
