import { AboutExperience } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "About Woven - Theme-Led Clothing Essentials",
  description: "Woven creates simple, considered clothing for daily wear, warm days, polished moments, and cold-weather layering.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <AboutExperience catalog={catalog} />;
}
