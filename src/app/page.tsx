import { HomeExperience } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export default async function Home() {
  const catalog = await getCatalogData();

  return <HomeExperience catalog={catalog} themeId="classic" />;
}
