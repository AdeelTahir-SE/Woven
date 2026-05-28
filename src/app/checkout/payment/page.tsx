import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Checkout Payment",
  description: "Complete your Woven clothing checkout with Safepay, cash on delivery, or bank transfer.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="checkout" catalog={catalog} />;
}
