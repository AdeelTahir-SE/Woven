import { CollectionIndexPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Collections - Woven Classic, Summer & Winter Edits",
  description: "Explore Woven collections across Plain Essentials, Formal Edit, Refined Basics, summer pieces, cold-air jackets, hoodies, and winter essentials.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalogData();

  return <CollectionIndexPage catalog={catalog} />;
}
