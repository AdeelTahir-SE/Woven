import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Woven's delivery policy, returns, fabric care, sizing, and payment options.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="faq" catalog={catalog} />;
}
