insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can manage product images" on storage.objects;
create policy "Authenticated users can manage product images"
on storage.objects
for all
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

alter table public.products add column if not exists image_path text;
alter table public.products add column if not exists image_alt text;
alter table public.products add column if not exists hover_image_path text;

update public.products
set
  image_path = coalesce(image_path, theme_id || '/' || collection_slug || '/' || slug || '.jpg'),
  image_alt = coalesce(image_alt, name || ' product image');

alter table public.products alter column image_path set not null;
alter table public.products alter column image_alt set not null;
