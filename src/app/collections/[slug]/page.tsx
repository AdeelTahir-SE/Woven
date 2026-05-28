import { notFound } from "next/navigation";
import { CollectionDetailPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";
import { getCollectionFromCatalog } from "@/lib/woven-data";

const SITE_URL = "https://woven.pk";

export async function generateStaticParams() {
  const catalog = await getCatalogData();

  return catalog.collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = getCollectionFromCatalog(await getCatalogData(), slug);

  if (!collection) {
    return { title: "Collection Not Found | Woven" };
  }

  return {
    title: `${collection.title} Collection - Woven`,
    description: collection.mood,
    openGraph: {
      title: `${collection.title} Collection - Woven Pakistan`,
      description: collection.mood,
      type: "website",
      locale: "en_PK",
      siteName: "Woven",
      url: `${SITE_URL}/collections/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} Collection - Woven`,
      description: collection.mood,
    },
    alternates: {
      canonical: `${SITE_URL}/collections/${slug}`,
      languages: { "en-PK": `${SITE_URL}/collections/${slug}` },
    },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const catalog = await getCatalogData();
  const collection = getCollectionFromCatalog(catalog, slug);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailPage catalog={catalog} collection={collection} />;
}
