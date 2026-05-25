import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Privacy Policy | Woven",
  description: "Read the Woven privacy policy.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="privacy" catalog={catalog} />;
}
