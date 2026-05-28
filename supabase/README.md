# Supabase migrations

This folder contains database migrations applied by GitHub Actions.

## Required GitHub repository secrets

Add these in GitHub under **Settings -> Secrets and variables -> Actions**:

- `SUPABASE_ACCESS_TOKEN`: Supabase personal access token.
- `SUPABASE_DB_URL`: Supabase Postgres connection string.
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for server writes and storage uploads.

Use the pooled connection string from Supabase if direct IPv6 database access is not available from GitHub Actions.

## How deployment works

On pushes to `main`, `.github/workflows/supabase-migrations.yml` runs:

```bash
supabase db push --db-url "$SUPABASE_DB_URL"
npm run upload:product-images
```

The migration creates the public `product-images` storage bucket and seeds catalog rows with image paths. The upload script then pushes the local studio images from `public/images/` to the matching Supabase Storage object paths.

Only files under `supabase/**`, `public/images/**`, the product image upload script, and the workflow file itself trigger this migration job.

## Local dry run

Install the Supabase CLI, then run:

```bash
supabase db push --db-url "$SUPABASE_DB_URL" --dry-run
```

Remove `--dry-run` when you are ready to apply migrations locally.
