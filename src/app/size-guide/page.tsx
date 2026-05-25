import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Size Guide | Woven",
  description: "Review Woven sizing and fit measurements.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="size" catalog={catalog} />;
}
