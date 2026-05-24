import { CollectionIndexPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Collections | Woven",
  description: "Browse all Woven university clothing collections.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalogData();

  return <CollectionIndexPage catalog={catalog} />;
}
