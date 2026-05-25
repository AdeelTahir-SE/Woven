import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "FAQs | Woven",
  description: "Frequently asked questions about Woven orders, sizing, delivery, and returns.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="faq" catalog={catalog} />;
}
