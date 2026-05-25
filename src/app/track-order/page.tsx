import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Track Order | Woven",
  description: "Track your Woven order status.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="track" catalog={catalog} />;
}
