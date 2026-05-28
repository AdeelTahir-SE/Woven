import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Contact Woven - Get in Touch",
  description: "Reach out to the Woven team for order support, wholesale inquiries, or press collaboration. We respond within 24 hours.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="contact" catalog={catalog} />;
}
