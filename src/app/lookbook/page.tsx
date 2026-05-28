import { LookbookPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Woven Lookbook - Minimal Outfits & Seasonal Layers",
  description: "Explore Woven outfits, cotton basics, everyday fits, hoodies, jackets, pants, and seasonal styling notes from a Pakistani clothing brand.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <LookbookPage catalog={catalog} />;
}
