import { ShopPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Shop Woven Clothing Pakistan - Tees, Hoodies, Pants & Jackets",
  description: "Browse Woven's minimal clothing essentials in Pakistan by fit, fabric, theme, and season. Shop cotton tees, shirts, pants, hoodies, jackets, sets, and scarves.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <ShopPage catalog={catalog} />;
}
