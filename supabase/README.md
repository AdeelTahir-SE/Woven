# Woven Supabase Setup

Run these files in the Supabase SQL editor in order. These files are PostgreSQL SQL for Supabase, not SQL Server / MySQL syntax.

1. `schema.sql`
2. `seed.sql`

For an existing Supabase project that already has the older Woven tables, run these migrations first:

1. `20260524_theme_system.sql`
2. `20260524_product_images_storage.sql`

Then copy `.env.example` to `.env.local` and fill in:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The app reads `collections` and `products` through Supabase REST. If the env vars are missing, requests fail, or the tables are empty, the site falls back to the local seed catalog so development still works.

## Product Images

The SQL creates a public Storage bucket named `product-images`.

Upload product files using the paths stored in `products.image_path`, for example:

```txt
product-images/classic/plain-essentials/clean-crew-tee.jpg
product-images/summer/sky-t-shirts/skyline-pocket-tee.jpg
product-images/winter/ice-hoodies/frostline-hoodie.jpg
```

The app renders images from:

```txt
{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/{image_path}
```

If an image has not been uploaded yet, the browser may show a broken external image; upload the file at the matching path to replace it.
