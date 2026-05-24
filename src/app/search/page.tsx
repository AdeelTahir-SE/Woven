import { SearchPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Search | Woven",
  description: "Search Woven products and collections.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SearchPage catalog={catalog} />;
}
