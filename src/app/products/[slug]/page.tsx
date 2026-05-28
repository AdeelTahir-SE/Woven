import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/woven-client";
import { getCatalogData } from "@/lib/supabase-catalog";
import { getCollectionFromCatalog, getProductFromCatalog } from "@/lib/woven-data";

const SITE_URL = "https://woven.pk";

function productImageUrl(imagePath: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return `${SITE_URL}/images/Woven_logo_with_tagline.png`;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${imagePath}`;
}

export async function generateStaticParams() {
  const catalog = await getCatalogData();

  return catalog.products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProductFromCatalog(await getCatalogData(), slug);

  if (!product) {
    return { title: "Product Not Found | Woven" };
  }

  const description = product.description.slice(0, 155);
  const image = productImageUrl(product.imagePath);

  return {
    title: `${product.name} - Woven`,
    description,
    openGraph: {
      title: `${product.name} - Woven Pakistan`,
      description,
      images: [{ url: image, width: 800, height: 1000, alt: product.imageAlt || product.name }],
      type: "website",
      locale: "en_PK",
      siteName: "Woven",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Woven`,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${SITE_URL}/products/${slug}`,
      languages: { "en-PK": `${SITE_URL}/products/${slug}` },
    },
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: productImageUrl(product.imagePath),
    description: product.description,
    brand: { "@type": "Brand", name: "Woven" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: Number(product.price.replace(/[^0-9]/g, "")),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Woven" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <ProductDetailPage catalog={catalog} product={product} collection={collection} />
    </>
  );
}
