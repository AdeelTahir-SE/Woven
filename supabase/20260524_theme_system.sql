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

insert into public.themes (
  id, label, tagline, hero_title, hero_media, nav_class, nav_text_class, strip_class, strip_text_class, page_class, accent_name, sort_order
) values
  ('classic', 'Classic', 'Plain, formal, and refined pieces for everyday life.', 'Woven', 'classic', 'border-woven-border bg-woven-bg/92', 'text-woven-text', 'border-woven-border bg-woven-bg/95', 'text-woven-text', 'theme-classic bg-woven-bg text-woven-text', 'heritage gold', 1),
  ('summer', 'Summer', 'Made for open skies, easy movement, and warm days together.', 'Woven', 'summer', 'border-black bg-black', 'text-black md:text-white', 'border-black bg-black', 'text-black', 'theme-summer bg-white text-black', 'sky blue', 2),
  ('winter', 'Winter', 'Layers for cold air, quiet light, and crisp winter days.', 'Woven', 'winter', 'border-winter-ice bg-winter-ice/95', 'text-winter-ink', 'border-winter-ice bg-winter-ice/95', 'text-winter-ink', 'theme-winter bg-winter-mist text-winter-ink', 'ice blue', 3)
on conflict (id) do update set
  label = excluded.label,
  tagline = excluded.tagline,
  hero_title = excluded.hero_title,
  hero_media = excluded.hero_media,
  nav_class = excluded.nav_class,
  nav_text_class = excluded.nav_text_class,
  strip_class = excluded.strip_class,
  strip_text_class = excluded.strip_text_class,
  page_class = excluded.page_class,
  accent_name = excluded.accent_name,
  sort_order = excluded.sort_order;

alter table public.collections add column if not exists theme_id text;
alter table public.products add column if not exists theme_id text;
alter table public.products add column if not exists image_path text;
alter table public.products add column if not exists image_alt text;
alter table public.products add column if not exists hover_image_path text;

update public.collections
set theme_id = case
  when slug in ('plain-essentials', 'formal-edit', 'refined-basics', 'thread-classics', 'minimal-edit', 'society') then 'classic'
  when slug in ('sky-t-shirts', 'light-pants', 'summer-sets') then 'summer'
  when slug in ('ice-hoodies', 'cold-air-jackets', 'winter-essentials') then 'winter'
  else coalesce(theme_id, 'classic')
end;

update public.products
set theme_id = case
  when collection_slug in ('plain-essentials', 'formal-edit', 'refined-basics', 'thread-classics', 'minimal-edit', 'society') then 'classic'
  when collection_slug in ('sky-t-shirts', 'light-pants', 'summer-sets') then 'summer'
  when collection_slug in ('ice-hoodies', 'cold-air-jackets', 'winter-essentials') then 'winter'
  else coalesce(theme_id, 'classic')
end;

update public.products
set
  image_path = coalesce(image_path, theme_id || '/' || collection_slug || '/' || slug || '.jpg'),
  image_alt = coalesce(image_alt, name || ' product image');

alter table public.collections alter column theme_id set not null;
alter table public.products alter column theme_id set not null;
alter table public.products alter column image_path set not null;
alter table public.products alter column image_alt set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'collections_theme_id_fkey'
  ) then
    alter table public.collections
    add constraint collections_theme_id_fkey foreign key (theme_id) references public.themes(id)
    on update cascade on delete restrict;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'products_theme_id_fkey'
  ) then
    alter table public.products
    add constraint products_theme_id_fkey foreign key (theme_id) references public.themes(id)
    on update cascade on delete restrict;
  end if;
end $$;

create index if not exists themes_sort_order_idx on public.themes(sort_order);
create index if not exists collections_theme_id_idx on public.collections(theme_id);
create index if not exists products_theme_id_idx on public.products(theme_id);

alter table public.themes enable row level security;

drop policy if exists "Public can read themes" on public.themes;
create policy "Public can read themes"
on public.themes
for select
using (true);
