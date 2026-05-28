-- Woven production schema for Supabase.
-- Applied by GitHub Actions with `supabase db push`.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.themes (
  id text primary key check (id in ('classic', 'summer', 'winter')),
  label text not null,
  tagline text not null,
  hero_title text not null,
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
  slug text primary key,
  theme_id text not null references public.themes(id) on update cascade on delete restrict,
  number text not null,
  title text not null,
  display_title text not null,
  tagline text not null,
  mood text not null,
  logo integer not null,
  logo_sheet integer not null default 1 check (logo_sheet in (1, 2)),
  bg_class text not null,
  text_class text not null,
  font_class text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  sku text primary key,
  slug text not null unique,
  name text not null,
  price_pkr integer not null check (price_pkr >= 0),
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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  shipping_pkr integer not null default 0 check (shipping_pkr >= 0),
  total_pkr integer not null check (total_pkr >= 0),
  currency text not null default 'PKR',
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'pay_on_delivery', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null references public.products(slug) on update cascade on delete restrict,
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price_pkr integer not null check (unit_price_pkr >= 0),
  line_total_pkr integer not null check (line_total_pkr >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'safepay' check (provider in ('safepay', 'cod', 'bank_transfer')),
  status text not null default 'pending'
    check (status in ('pending', 'authorized', 'paid', 'failed', 'refunded', 'pay_on_delivery')),
  amount_pkr integer not null check (amount_pkr >= 0),
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collections_theme_sort_idx on public.collections(theme_id, sort_order);
create index if not exists products_collection_sort_idx on public.products(collection_slug, sort_order);
create index if not exists products_theme_sort_idx on public.products(theme_id, sort_order);
create index if not exists orders_email_created_idx on public.orders(email, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists payments_order_idx on public.payments(order_id);
create unique index if not exists payments_provider_reference_unique_idx
  on public.payments(provider_reference)
  where provider_reference is not null;

drop trigger if exists set_themes_updated_at on public.themes;
create trigger set_themes_updated_at
before update on public.themes
for each row execute function public.set_updated_at();

drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.themes enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Catalog themes are public" on public.themes;
create policy "Catalog themes are public"
on public.themes for select
to anon, authenticated
using (true);

drop policy if exists "Catalog collections are public" on public.collections;
create policy "Catalog collections are public"
on public.collections for select
to anon, authenticated
using (true);

drop policy if exists "Catalog products are public" on public.products;
create policy "Catalog products are public"
on public.products for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select on public.themes, public.collections, public.products to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Product images are public" on storage.objects;
create policy "Product images are public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

insert into public.themes (
  id, label, tagline, hero_title, hero_media, nav_class, nav_text_class,
  strip_class, strip_text_class, page_class, accent_name, sort_order
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

insert into public.collections (
  slug, theme_id, number, title, display_title, tagline, mood,
  logo, logo_sheet, bg_class, text_class, font_class, sort_order
) values
  ('plain-essentials', 'classic', '01', 'Plain Essentials', 'Plain Essentials', 'Clean Daily Pieces', 'Simple, reliable clothes with quiet detail and a refined everyday shape.', 1, 1, 'bg-woven-bg', 'text-woven-text', 'font-display', 1),
  ('formal-edit', 'classic', '02', 'Formal Edit', 'Formal Edit', 'Soft Structure', 'Polished layers for dinners, meetings, events, and the days that ask for more.', 7, 1, 'bg-woven-tan', 'text-woven-text', 'font-playfair', 2),
  ('refined-basics', 'classic', '03', 'Refined Basics', 'refined basics', 'Less. Better.', 'Muted tones, considered cuts, and easy silhouettes for repeat wear.', 5, 1, 'bg-woven-surface', 'text-woven-text', 'font-syne', 3),
  ('sky-t-shirts', 'summer', '01', 'Sky T-Shirts', 'Sky T-Shirts', 'Light Above Everything', 'Breathable tees in clear colors, cut for open days and easy movement.', 2, 1, 'bg-summer-sky', 'text-black', 'font-grotesk', 4),
  ('light-pants', 'summer', '02', 'Light Pants', 'Light Pants', 'Move With The Heat', 'Airy pants with enough structure for city plans and enough ease for long afternoons.', 4, 1, 'bg-white', 'text-black', 'font-syne', 5),
  ('summer-sets', 'summer', '03', 'Summer Sets', 'Summer Sets', 'Ready Together', 'Warm-weather pairings that feel relaxed, bright, and simple to wear.', 8, 1, 'bg-summer-warm', 'text-black', 'font-display', 6),
  ('ice-hoodies', 'winter', '01', 'Ice Hoodies', 'Ice Hoodies', 'Soft Cold-Weather Weight', 'Brushed fleece, calm colors, and easy warmth for cold mornings.', 3, 1, 'bg-winter-ice', 'text-winter-ink', 'font-grotesk', 7),
  ('cold-air-jackets', 'winter', '02', 'Cold-Air Jackets', 'Cold-Air Jackets', 'Outside Layer', 'Protective shells and puffers shaped for crisp air and shifting weather.', 6, 1, 'bg-winter-steel', 'text-winter-ink', 'font-rajdhani', 8),
  ('winter-essentials', 'winter', '03', 'Winter Essentials', 'Winter Essentials', 'Quiet Warmth', 'Thermal layers and small cold-weather pieces made for daily comfort.', 9, 1, 'bg-winter-mist', 'text-winter-ink', 'font-playfair', 9)
on conflict (slug) do update set
  theme_id = excluded.theme_id,
  number = excluded.number,
  title = excluded.title,
  display_title = excluded.display_title,
  tagline = excluded.tagline,
  mood = excluded.mood,
  logo = excluded.logo,
  logo_sheet = excluded.logo_sheet,
  bg_class = excluded.bg_class,
  text_class = excluded.text_class,
  font_class = excluded.font_class,
  sort_order = excluded.sort_order;

insert into public.products (
  sku, slug, name, price_pkr, theme_id, collection_slug, image_path,
  image_alt, hover_image_path, sizes, palette, status, description, material, sort_order
) values
  ('pe-01', 'clean-crew-tee', 'Clean Crew Tee', 3200, 'classic', 'plain-essentials', 'classic/plain-essentials/clean-crew-tee.png', 'Clean Crew Tee product image', null, array['XS','S','M','L','XL'], 'from-stone-100 via-neutral-200 to-stone-300', 'New', 'A soft heavyweight crew with a straight fit and a quiet stitched Woven mark.', '240gsm cotton jersey with reinforced shoulder seams.', 1),
  ('pe-02', 'everyday-oxford-shirt', 'Everyday Oxford Shirt', 4800, 'classic', 'plain-essentials', 'classic/plain-essentials/everyday-oxford-shirt.png', 'Everyday Oxford Shirt product image', null, array['XS','S','M','L','XL'], 'from-zinc-100 via-stone-100 to-neutral-300', null, 'A brushed cotton oxford with a relaxed fit, soft collar, and clean cuff finish.', '220gsm cotton oxford, corozo buttons, reinforced seams.', 2),
  ('fe-01', 'soft-structure-blazer', 'Soft Structure Blazer', 12800, 'classic', 'formal-edit', 'classic/formal-edit/soft-structure-blazer.png', 'Soft Structure Blazer product image', null, array['XS','S','M','L'], 'from-neutral-900 via-stone-700 to-woven-tan', 'New', 'An unstructured blazer with natural shoulders, clean lining, and a polished daily shape.', 'Cotton wool blend with satin jacquard lining.', 3),
  ('fe-02', 'tailored-waistcoat', 'Tailored Waistcoat', 7300, 'classic', 'formal-edit', 'classic/formal-edit/tailored-waistcoat.png', 'Tailored Waistcoat product image', null, array['S','M','L','XL'], 'from-stone-700 via-woven-tan to-amber-100', null, 'A neat waistcoat with double-rule stitching, horn buttons, and an easy formal finish.', 'Textured cotton blend, horn buttons, contrast piping.', 4),
  ('rb-01', 'folded-seam-overshirt', 'Folded Seam Overshirt', 7900, 'classic', 'refined-basics', 'classic/refined-basics/folded-seam-overshirt.png', 'Folded Seam Overshirt product image', null, array['XS','S','M','L'], 'from-neutral-300 via-stone-200 to-zinc-100', null, 'A quiet overshirt with hidden pockets, flat-felled seams, and a sharp box silhouette.', 'Midweight cotton twill with recycled poly lining.', 5),
  ('rb-02', 'paperweight-trouser', 'Paperweight Trouser', 5600, 'classic', 'refined-basics', 'classic/refined-basics/paperweight-trouser.png', 'Paperweight Trouser product image', null, array['S','M','L','XL'], 'from-stone-200 via-neutral-100 to-stone-300', null, 'Pleated, cropped, and easy to move in, made for long days and clean silhouettes.', 'Cotton poplin blend with a matte hand feel.', 6),
  ('st-01', 'skyline-pocket-tee', 'Skyline Pocket Tee', 3000, 'summer', 'sky-t-shirts', 'summer/sky-t-shirts/skyline-pocket-tee.png', 'Skyline Pocket Tee product image', null, array['XS','S','M','L','XL'], 'from-sky-200 via-cyan-100 to-yellow-100', 'New', 'A breathable pocket tee with a relaxed shoulder and sun-washed color.', 'Cotton jersey with garment-washed softness.', 7),
  ('st-02', 'sun-drift-tee', 'Sun Drift Tee', 3100, 'summer', 'sky-t-shirts', 'summer/sky-t-shirts/sun-drift-tee.png', 'Sun Drift Tee product image', null, array['S','M','L','XL'], 'from-blue-100 via-sky-300 to-white', null, 'A clean summer tee with airy weight, smooth neckline, and easy daily drape.', 'Lightweight combed cotton jersey.', 8),
  ('lp-01', 'breeze-cotton-pant', 'Breeze Cotton Pant', 5400, 'summer', 'light-pants', 'summer/light-pants/breeze-cotton-pant.png', 'Breeze Cotton Pant product image', null, array['S','M','L','XL'], 'from-stone-100 via-sky-100 to-cyan-200', 'New', 'Straight-leg cotton pants with a soft hand feel and room for warm-weather movement.', 'Cotton poplin with elastic side tabs.', 9),
  ('lp-02', 'open-air-chino', 'Open Air Chino', 5800, 'summer', 'light-pants', 'summer/light-pants/open-air-chino.png', 'Open Air Chino product image', null, array['S','M','L','XL'], 'from-cyan-100 via-white to-yellow-100', null, 'A tapered chino with lightweight structure, clean pockets, and a bright summer finish.', 'Cotton twill with a breathable weave.', 10),
  ('ssu-01', 'sunset-easy-set', 'Sunset Easy Set', 8600, 'summer', 'summer-sets', 'summer/summer-sets/sunset-easy-set.png', 'Sunset Easy Set product image', null, array['S','M','L'], 'from-sky-300 via-orange-100 to-white', 'New', 'A matching tee and pant set for slow weekends, travel days, and outdoor plans.', 'Cotton linen blend with soft rib trim.', 11),
  ('ssu-02', 'poolside-knit-polo', 'Poolside Knit Polo', 5200, 'summer', 'summer-sets', 'summer/summer-sets/poolside-knit-polo.png', 'Poolside Knit Polo product image', null, array['S','M','L','XL'], 'from-white via-sky-100 to-blue-200', null, 'Fine rib texture, structured placket, and a light hand for sunny-day polish.', 'Cotton viscose knit with ribbed cuffs and collar.', 12),
  ('ih-01', 'frostline-hoodie', 'Frostline Hoodie', 6400, 'winter', 'ice-hoodies', 'winter/ice-hoodies/frostline-hoodie.png', 'Frostline Hoodie product image', null, array['S','M','L','XL'], 'from-slate-200 via-blue-100 to-white', 'New', 'Heavy fleece hoodie with a soft brushed interior and a clean ice-toned finish.', '340gsm brushed fleece, rib inserts, woven label.', 13),
  ('ih-02', 'snowfield-zip-hoodie', 'Snowfield Zip Hoodie', 6900, 'winter', 'ice-hoodies', 'winter/ice-hoodies/snowfield-zip-hoodie.png', 'Snowfield Zip Hoodie product image', null, array['S','M','L','XL'], 'from-white via-slate-100 to-blue-200', null, 'A full-zip hoodie with layered pockets, warm ribbing, and soft winter weight.', 'Cotton fleece with brushed interior and metal zip.', 14),
  ('caj-01', 'cold-air-puffer', 'Cold Air Puffer', 11800, 'winter', 'cold-air-jackets', 'winter/cold-air-jackets/cold-air-puffer.png', 'Cold Air Puffer product image', null, array['S','M','L','XL'], 'from-slate-800 via-blue-200 to-white', 'New', 'A warm puffer with a high collar, cloud-soft fill, and crisp winter silhouette.', 'Water-resistant nylon shell with recycled poly fill.', 15),
  ('caj-02', 'glacier-shell-jacket', 'Glacier Shell Jacket', 8400, 'winter', 'cold-air-jackets', 'winter/cold-air-jackets/glacier-shell-jacket.png', 'Glacier Shell Jacket product image', null, array['S','M','L'], 'from-cyan-950 via-slate-700 to-blue-100', null, 'A protective shell jacket with a packable hood and reflective winter detailing.', 'Water-resistant nylon, mesh lining, reflective heat transfer.', 16),
  ('we-01', 'thermal-layer-tee', 'Thermal Layer Tee', 3600, 'winter', 'winter-essentials', 'winter/winter-essentials/thermal-layer-tee.png', 'Thermal Layer Tee product image', null, array['S','M','L','XL'], 'from-slate-100 via-white to-cyan-100', null, 'A warm first layer with a smooth face, brushed back, and easy stretch.', 'Cotton thermal blend with flatlock seams.', 17),
  ('we-02', 'quiet-snow-scarf', 'Quiet Snow Scarf', 2900, 'winter', 'winter-essentials', 'winter/winter-essentials/quiet-snow-scarf.png', 'Quiet Snow Scarf product image', null, array['One Size'], 'from-white via-blue-100 to-slate-200', 'New', 'A soft winter scarf with subtle texture and a clean Woven tab.', 'Acrylic wool blend with soft fringe edges.', 18)
on conflict (sku) do update set
  slug = excluded.slug,
  name = excluded.name,
  price_pkr = excluded.price_pkr,
  theme_id = excluded.theme_id,
  collection_slug = excluded.collection_slug,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  hover_image_path = excluded.hover_image_path,
  sizes = excluded.sizes,
  palette = excluded.palette,
  status = excluded.status,
  description = excluded.description,
  material = excluded.material,
  sort_order = excluded.sort_order;
