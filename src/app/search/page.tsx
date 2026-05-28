import { SearchPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Search Woven Clothing",
  description: "Search Woven products and collections across cotton tees, shirts, pants, hoodies, jackets, formal layers, and seasonal essentials.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SearchPage catalog={catalog} />;
}
