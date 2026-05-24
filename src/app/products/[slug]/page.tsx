import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/woven-client";
import { getCollection, getProduct, products } from "@/lib/woven-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);

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
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const collection = getCollection(product.collection);

  if (!collection) {
    notFound();
  }

  return <ProductDetailPage product={product} collection={collection} />;
}
