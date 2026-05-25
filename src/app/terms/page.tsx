import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Terms & Conditions | Woven",
  description: "Read the Woven terms and conditions.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="terms" catalog={catalog} />;
}
