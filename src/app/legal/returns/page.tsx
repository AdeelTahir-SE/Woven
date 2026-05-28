import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Shipping & Returns",
  description: "Review Woven delivery, exchange, return, privacy, and terms details before placing your order.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="returns" catalog={catalog} />;
}
