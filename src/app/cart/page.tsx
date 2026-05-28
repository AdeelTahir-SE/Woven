import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Cart",
  description: "Review your Woven clothing cart before checkout.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="cart" catalog={catalog} />;
}
