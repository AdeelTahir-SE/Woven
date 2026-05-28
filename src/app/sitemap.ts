import type { MetadataRoute } from "next";
import { getCatalogData } from "@/lib/supabase-catalog";

const BASE_URL = "https://woven.pk";

function localizedRoute(path = "") {
  const url = `${BASE_URL}${path}`;

  return {
    url,
    alternates: {
      languages: {
        "en-PK": url,
        "x-default": url,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalogData();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { ...localizedRoute(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { ...localizedRoute("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { ...localizedRoute("/collections"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { ...localizedRoute("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { ...localizedRoute("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { ...localizedRoute("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { ...localizedRoute("/size-guide"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { ...localizedRoute("/legal/returns"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { ...localizedRoute("/privacy"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { ...localizedRoute("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = catalog.products.map((product) => ({
    ...localizedRoute(`/products/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = catalog.collections.map((collection) => ({
    ...localizedRoute(`/collections/${collection.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
