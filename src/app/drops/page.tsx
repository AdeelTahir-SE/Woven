import { DropsPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Drops | Woven",
  description: "Limited Woven drops with live countdowns and notify-me states.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <DropsPage catalog={catalog} />;
}
