import { CollectionIndexPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Woven Collections - Classic, Summer & Winter Clothing",
  description: "Explore Woven clothing collections across Plain Essentials, Formal Edit, Refined Basics, summer tees, light pants, hoodies, jackets, and winter accessories.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalogData();

  return <CollectionIndexPage catalog={catalog} />;
}
