import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Checkout | Woven",
  description: "Complete your Woven checkout.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="checkout" catalog={catalog} />;
}
