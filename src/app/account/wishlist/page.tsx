import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Wishlist | Woven",
  description: "Your saved Woven items.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="account" catalog={catalog} />;
}
