# Woven Supabase Setup

Run these files in the Supabase SQL editor in order. These files are PostgreSQL SQL for Supabase, not SQL Server / MySQL syntax.

1. `schema.sql`
2. `seed.sql`

Then copy `.env.example` to `.env.local` and fill in:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The app reads `collections` and `products` through Supabase REST. If the env vars are missing, requests fail, or the tables are empty, the site falls back to the local seed catalog so development still works.
