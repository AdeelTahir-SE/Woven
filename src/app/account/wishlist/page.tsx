import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Wishlist",
  description: "View your saved Woven clothing essentials and seasonal layers.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="account" catalog={catalog} />;
}
