import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";
import { fallbackCatalog, getCollectionFromCatalog, getProductFromCatalog } from "@/lib/woven-data";

export function generateStaticParams() {
  return fallbackCatalog.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProductFromCatalog(await getCatalogData(), slug);

  if (!product) {
    return { title: "Product Not Found | Woven" };
  }

  return {
    title: `${product.name} | Woven`,
    description: product.description,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const catalog = await getCatalogData();
  const product = getProductFromCatalog(catalog, slug);

  if (!product) {
    notFound();
  }

  const collection = getCollectionFromCatalog(catalog, product.collection);

  if (!collection) {
    notFound();
  }

  return <ProductDetailPage product={product} collection={collection} />;
}
