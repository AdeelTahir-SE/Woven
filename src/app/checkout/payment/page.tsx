import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Payment | Woven",
  description: "Select a Woven payment method.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="checkout" catalog={catalog} />;
}
