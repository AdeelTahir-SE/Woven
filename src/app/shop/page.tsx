import { ShopPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Shop | Woven",
  description: "Shop Woven everyday essentials, edited by fit, fabric, and repeat wear.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <ShopPage catalog={catalog} />;
}
