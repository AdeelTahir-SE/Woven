import {
  buildCollections,
  fallbackCatalog,
  mapSupabaseTheme,
  mapSupabaseCollection,
  mapSupabaseProduct,
  type CatalogData,
  type Collection,
  type Product,
  type SupabaseThemeRow,
  type SupabaseCollectionRow,
  type SupabaseProductRow,
} from "@/lib/woven-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function makeSupabaseUrl(table: string, query: string) {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?${query}`;
}

async function fetchTable<Row>(table: string, query: string): Promise<Row[]> {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.");
  }

  const response = await fetch(makeSupabaseUrl(table, query), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Supabase ${table} request failed with ${response.status}.`);
  }

  return response.json() as Promise<Row[]>;
}

export async function getCatalogData(): Promise<CatalogData> {
  if (!hasSupabaseConfig()) {
    return fallbackCatalog;
  }

  try {
    const [themeRows, collectionRows, productRows] = await Promise.all([
      fetchTable<SupabaseThemeRow>("themes", "select=*&order=sort_order.asc"),
      fetchTable<SupabaseCollectionRow>("collections", "select=*&order=sort_order.asc"),
      fetchTable<SupabaseProductRow>("products", "select=*&order=sort_order.asc"),
    ]);

    if (themeRows.length === 0 || collectionRows.length === 0 || productRows.length === 0) {
      return fallbackCatalog;
    }

    const themes = themeRows.map(mapSupabaseTheme);
    const catalogProducts = productRows.map(mapSupabaseProduct);
    const collectionShells = collectionRows.map(mapSupabaseCollection);

    return {
      themes,
      collections: buildCollections(collectionShells, catalogProducts),
      products: catalogProducts,
    };
  } catch (error) {
    console.warn(error);
    return fallbackCatalog;
  }
}

export async function getCollections(): Promise<Collection[]> {
  return (await getCatalogData()).collections;
}

export async function getProducts(): Promise<Product[]> {
  return (await getCatalogData()).products;
}
