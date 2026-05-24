create extension if not exists "pgcrypto";

create table if not exists public.themes (
  id text primary key check (id in ('classic', 'summer', 'winter')),
  label text not null,
  tagline text not null,
  hero_title text not null default 'Woven',
  hero_media text not null check (hero_media in ('classic', 'summer', 'winter')),
  nav_class text not null,
  nav_text_class text not null,
  strip_class text not null,
  strip_text_class text not null,
  page_class text not null,
  accent_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  theme_id text not null references public.themes(id) on update cascade on delete restrict,
  number text not null,
  title text not null,
  display_title text not null,
  tagline text not null,
  mood text not null,
  logo integer not null check (logo between 1 and 9),
  logo_sheet integer not null default 1 check (logo_sheet in (1, 2)),
  bg_class text not null,
  text_class text not null,
  font_class text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  name text not null,
  price_pkr integer not null check (price_pkr > 0),
  theme_id text not null references public.themes(id) on update cascade on delete restrict,
  collection_slug text not null references public.collections(slug) on update cascade on delete restrict,
  image_path text not null,
  image_alt text not null,
  hover_image_path text,
  sizes text[] not null default '{}',
  palette text not null,
  status text check (status in ('New', 'Sold Out', 'Notify Me')),
  description text not null,
  material text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists themes_sort_order_idx on public.themes(sort_order);
create index if not exists collections_theme_id_idx on public.collections(theme_id);
create index if not exists collections_sort_order_idx on public.collections(sort_order);
create index if not exists products_theme_id_idx on public.products(theme_id);
create index if not exists products_collection_slug_idx on public.products(collection_slug);
create index if not exists products_sort_order_idx on public.products(sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists themes_set_updated_at on public.themes;
create trigger themes_set_updated_at
before update on public.themes
for each row execute function public.set_updated_at();

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.themes enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read themes" on public.themes;
create policy "Public can read themes"
on public.themes
for select
using (true);

drop policy if exists "Public can read collections" on public.collections;
create policy "Public can read collections"
on public.collections
for select
using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products
for select
using (true);

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
