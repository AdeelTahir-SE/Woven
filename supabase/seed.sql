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

insert into public.collections (
  slug, theme_id, number, title, display_title, tagline, mood, logo, logo_sheet, bg_class, text_class, font_class, sort_order
) values
  ('plain-essentials', 'classic', '01', 'Plain Essentials', 'Plain Essentials', 'Clean Daily Pieces', 'Simple, reliable clothes with quiet detail and a refined everyday shape.', 1, 1, 'bg-woven-bg', 'text-woven-text', 'font-display', 1),
  ('formal-edit', 'classic', '02', 'Formal Edit', 'Formal Edit', 'Soft Structure', 'Polished layers for dinners, meetings, events, and the days that ask for more.', 7, 1, 'bg-woven-tan', 'text-woven-text', 'font-playfair', 2),
  ('refined-basics', 'classic', '03', 'Refined Basics', 'refined basics', 'Less. Better.', 'Muted tones, considered cuts, and easy silhouettes for repeat wear.', 5, 1, 'bg-woven-surface', 'text-woven-text', 'font-syne', 3),
  ('sky-t-shirts', 'summer', '01', 'Sky T-Shirts', 'Sky T-Shirts', 'Light Above Everything', 'Breathable tees in clear colors, cut for open days and easy movement.', 2, 1, 'bg-summer-sky', 'text-black', 'font-grotesk', 1),
  ('light-pants', 'summer', '02', 'Light Pants', 'Light Pants', 'Move With The Heat', 'Airy pants with enough structure for city plans and enough ease for long afternoons.', 4, 1, 'bg-white', 'text-black', 'font-syne', 2),
  ('summer-sets', 'summer', '03', 'Summer Sets', 'Summer Sets', 'Ready Together', 'Warm-weather pairings that feel relaxed, bright, and simple to wear.', 8, 1, 'bg-summer-warm', 'text-black', 'font-display', 3),
  ('ice-hoodies', 'winter', '01', 'Ice Hoodies', 'Ice Hoodies', 'Soft Cold-Weather Weight', 'Brushed fleece, calm colors, and easy warmth for cold mornings.', 3, 1, 'bg-winter-ice', 'text-winter-ink', 'font-grotesk', 1),
  ('cold-air-jackets', 'winter', '02', 'Cold-Air Jackets', 'Cold-Air Jackets', 'Outside Layer', 'Protective shells and puffers shaped for crisp air and shifting weather.', 6, 1, 'bg-winter-steel', 'text-winter-ink', 'font-rajdhani', 2),
  ('winter-essentials', 'winter', '03', 'Winter Essentials', 'Winter Essentials', 'Quiet Warmth', 'Thermal layers and small cold-weather pieces made for daily comfort.', 9, 1, 'bg-winter-mist', 'text-winter-ink', 'font-playfair', 3)
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
  sku, slug, name, price_pkr, theme_id, collection_slug, image_path, image_alt, hover_image_path, sizes, palette, status, description, material, sort_order
) values
  ('PE-01','clean-crew-tee','Clean Crew Tee',3200,'classic','plain-essentials','classic/plain-essentials/clean-crew-tee.jpg','Clean Crew Tee product image',null,array['XS','S','M','L','XL'],'from-stone-100 via-neutral-200 to-stone-300','New','A soft heavyweight crew with a straight fit and a quiet stitched Woven mark.','240gsm cotton jersey with reinforced shoulder seams.',1),
  ('PE-02','everyday-oxford-shirt','Everyday Oxford Shirt',4800,'classic','plain-essentials','classic/plain-essentials/everyday-oxford-shirt.jpg','Everyday Oxford Shirt product image',null,array['XS','S','M','L','XL'],'from-zinc-100 via-stone-100 to-neutral-300',null,'A brushed cotton oxford with a relaxed fit, soft collar, and clean cuff finish.','220gsm cotton oxford, corozo buttons, reinforced seams.',2),
  ('FE-01','soft-structure-blazer','Soft Structure Blazer',12800,'classic','formal-edit','classic/formal-edit/soft-structure-blazer.jpg','Soft Structure Blazer product image',null,array['XS','S','M','L'],'from-neutral-900 via-stone-700 to-woven-tan','New','An unstructured blazer with natural shoulders, clean lining, and a polished daily shape.','Cotton wool blend with satin jacquard lining.',1),
  ('FE-02','tailored-waistcoat','Tailored Waistcoat',7300,'classic','formal-edit','classic/formal-edit/tailored-waistcoat.jpg','Tailored Waistcoat product image',null,array['S','M','L','XL'],'from-stone-700 via-woven-tan to-amber-100',null,'A neat waistcoat with double-rule stitching, horn buttons, and an easy formal finish.','Textured cotton blend, horn buttons, contrast piping.',2),
  ('RB-01','folded-seam-overshirt','Folded Seam Overshirt',7900,'classic','refined-basics','classic/refined-basics/folded-seam-overshirt.jpg','Folded Seam Overshirt product image',null,array['XS','S','M','L'],'from-neutral-300 via-stone-200 to-zinc-100','New','A quiet overshirt with hidden pockets, flat-felled seams, and a sharp box silhouette.','Midweight cotton twill with recycled poly lining.',1),
  ('RB-02','paperweight-trouser','Paperweight Trouser',5600,'classic','refined-basics','classic/refined-basics/paperweight-trouser.jpg','Paperweight Trouser product image',null,array['S','M','L','XL'],'from-stone-200 via-neutral-100 to-stone-300',null,'Pleated, cropped, and easy to move in, made for long days and clean silhouettes.','Cotton poplin blend with a matte hand feel.',2),
  ('ST-01','skyline-pocket-tee','Skyline Pocket Tee',3000,'summer','sky-t-shirts','summer/sky-t-shirts/skyline-pocket-tee.jpg','Skyline Pocket Tee product image',null,array['XS','S','M','L','XL'],'from-sky-200 via-cyan-100 to-yellow-100','New','A breathable pocket tee with a relaxed shoulder and sun-washed color.','Cotton jersey with garment-washed softness.',1),
  ('ST-02','sun-drift-tee','Sun Drift Tee',3100,'summer','sky-t-shirts','summer/sky-t-shirts/sun-drift-tee.jpg','Sun Drift Tee product image',null,array['S','M','L','XL'],'from-blue-100 via-sky-300 to-white',null,'A clean summer tee with airy weight, smooth neckline, and easy daily drape.','Lightweight combed cotton jersey.',2),
  ('LP-01','breeze-cotton-pant','Breeze Cotton Pant',5400,'summer','light-pants','summer/light-pants/breeze-cotton-pant.jpg','Breeze Cotton Pant product image',null,array['S','M','L','XL'],'from-stone-100 via-sky-100 to-cyan-200','New','Straight-leg cotton pants with a soft hand feel and room for warm-weather movement.','Cotton poplin with elastic side tabs.',1),
  ('LP-02','open-air-chino','Open Air Chino',5800,'summer','light-pants','summer/light-pants/open-air-chino.jpg','Open Air Chino product image',null,array['S','M','L','XL'],'from-cyan-100 via-white to-yellow-100',null,'A tapered chino with lightweight structure, clean pockets, and a bright summer finish.','Cotton twill with a breathable weave.',2),
  ('SSU-01','sunset-easy-set','Sunset Easy Set',8600,'summer','summer-sets','summer/summer-sets/sunset-easy-set.jpg','Sunset Easy Set product image',null,array['S','M','L'],'from-sky-300 via-orange-100 to-white','New','A matching tee and pant set for slow weekends, travel days, and outdoor plans.','Cotton linen blend with soft rib trim.',1),
  ('SSU-02','poolside-knit-polo','Poolside Knit Polo',5200,'summer','summer-sets','summer/summer-sets/poolside-knit-polo.jpg','Poolside Knit Polo product image',null,array['S','M','L','XL'],'from-white via-sky-100 to-blue-200',null,'Fine rib texture, structured placket, and a light hand for sunny-day polish.','Cotton viscose knit with ribbed cuffs and collar.',2),
  ('IH-01','frostline-hoodie','Frostline Hoodie',6400,'winter','ice-hoodies','winter/ice-hoodies/frostline-hoodie.jpg','Frostline Hoodie product image',null,array['S','M','L','XL'],'from-slate-200 via-blue-100 to-white','New','Heavy fleece hoodie with a soft brushed interior and a clean ice-toned finish.','340gsm brushed fleece, rib inserts, woven label.',1),
  ('IH-02','snowfield-zip-hoodie','Snowfield Zip Hoodie',6900,'winter','ice-hoodies','winter/ice-hoodies/snowfield-zip-hoodie.jpg','Snowfield Zip Hoodie product image',null,array['S','M','L','XL'],'from-white via-slate-100 to-blue-200',null,'A full-zip hoodie with layered pockets, warm ribbing, and soft winter weight.','Cotton fleece with brushed interior and metal zip.',2),
  ('CAJ-01','cold-air-puffer','Cold Air Puffer',11800,'winter','cold-air-jackets','winter/cold-air-jackets/cold-air-puffer.jpg','Cold Air Puffer product image',null,array['S','M','L','XL'],'from-slate-800 via-blue-200 to-white','New','A warm puffer with a high collar, cloud-soft fill, and crisp winter silhouette.','Water-resistant nylon shell with recycled poly fill.',1),
  ('CAJ-02','glacier-shell-jacket','Glacier Shell Jacket',8400,'winter','cold-air-jackets','winter/cold-air-jackets/glacier-shell-jacket.jpg','Glacier Shell Jacket product image',null,array['S','M','L'],'from-cyan-950 via-slate-700 to-blue-100',null,'A protective shell jacket with a packable hood and reflective winter detailing.','Water-resistant nylon, mesh lining, reflective heat transfer.',2),
  ('WE-01','thermal-layer-tee','Thermal Layer Tee',3600,'winter','winter-essentials','winter/winter-essentials/thermal-layer-tee.jpg','Thermal Layer Tee product image',null,array['S','M','L','XL'],'from-slate-100 via-white to-cyan-100',null,'A warm first layer with a smooth face, brushed back, and easy stretch.','Cotton thermal blend with flatlock seams.',1),
  ('WE-02','quiet-snow-scarf','Quiet Snow Scarf',2900,'winter','winter-essentials','winter/winter-essentials/quiet-snow-scarf.jpg','Quiet Snow Scarf product image',null,array['One Size'],'from-white via-blue-100 to-slate-200','New','A soft winter scarf with subtle texture and a clean Woven tab.','Acrylic wool blend with soft fringe edges.',2)
on conflict (slug) do update set
  sku = excluded.sku,
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
