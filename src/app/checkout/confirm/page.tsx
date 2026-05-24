import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Confirm Order | Woven",
  description: "Confirm your Woven order.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="checkout" catalog={catalog} />;
}
