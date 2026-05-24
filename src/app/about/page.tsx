import { SimpleContentPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "About | Woven",
  description: "The Woven story and student-first brand manifesto.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <SimpleContentPage type="about" catalog={catalog} />;
}
