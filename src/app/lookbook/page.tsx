import { LookbookPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Lookbook | Woven",
  description: "Explore Woven looks, everyday fits, and editorial style notes.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <LookbookPage catalog={catalog} />;
}
