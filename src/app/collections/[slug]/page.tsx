import { notFound } from "next/navigation";
import { CollectionDetailPage } from "@/components/woven-client";
import { collections, getCollection } from "@/lib/woven-data";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found | Woven" };
  }

  return {
    title: `${collection.title} | Woven`,
    description: collection.mood,
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailPage collection={collection} />;
}
