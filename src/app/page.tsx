import { HomeExperience } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";

export default async function Home() {
  const catalog = await getCatalogData();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Woven",
    url: "https://woven.pk",
    logo: "https://woven.pk/woven-wordmark.png",
    sameAs: ["https://www.instagram.com/wovenpk", "https://www.facebook.com/wovenpk"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@woven.pk",
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
      areaServed: "PK",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <HomeExperience catalog={catalog} themeId="classic" />
    </>
  );
}
