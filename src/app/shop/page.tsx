import { ShopPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Shop Woven Clothing - Everyday Essentials & Seasonal Layers",
  description: "Browse Woven clothing by fit, fabric, theme, and season. Shop tees, shirts, pants, blazers, hoodies, jackets, sets, scarves, and repeat-wear essentials.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <ShopPage catalog={catalog} />;
}
