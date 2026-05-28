import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Woven handles order data, support messages, email usage, analytics, and service providers such as Supabase and Vercel.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="privacy" catalog={catalog} />;
}
