import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Returns | Woven",
  description: "Woven returns and exchange information.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="legal" catalog={catalog} />;
}
