import { CollectionIndexPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Collections | Woven",
  description: "Browse Woven collections across Classic, Summer, and Winter themes.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalogData();

  return <CollectionIndexPage catalog={catalog} />;
}
