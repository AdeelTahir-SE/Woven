import { InfoPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export const metadata = {
  title: "Contact | Woven",
  description: "Contact the Woven customer care team.",
};

export default async function Page() {
  const catalog = await getCatalogData();

  return <InfoPage type="contact" catalog={catalog} />;
}
