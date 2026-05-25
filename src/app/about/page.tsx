import { AboutExperience } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "About | Woven",
  description: "The Woven story, theme system, and clothing worlds.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <AboutExperience catalog={catalog} />;
}
