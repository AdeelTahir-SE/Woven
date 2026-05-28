import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Size Guide - Woven Clothing Fits & Measurements",
  description: "Use Woven's size guide for tees, shirts, pants, blazers, hoodies, jackets, sets, and one-size accessories.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="size" catalog={catalog} />;
}
