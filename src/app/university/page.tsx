import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "University Program | Woven",
  description: "Student verification, discounts, and campus ambassador details.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="university" catalog={catalog} />;
}
