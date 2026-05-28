import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Terms & Conditions",
  description: "Review Woven ordering, payment, delivery, returns, and Pakistani jurisdiction terms before placing your order.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="terms" catalog={catalog} />;
}
