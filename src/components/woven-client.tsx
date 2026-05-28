"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  fallbackCatalog,
  type CatalogData,
  type Collection,
  type Product,
  type ThemeId,
} from "@/lib/woven-data";

export const SALE_DISCOUNT_PERCENT = 30;
export const SALE_TEXT = `SALE ${SALE_DISCOUNT_PERCENT}% OFF EVERYTHING`;

type CartProduct = Product & { cartQuantity: number; cartSize: string };
type CartLine = {
  slug: string;
  size: string;
  quantity: number;
};
type CheckoutItem = {
  productSlug: string;
  name: string;
  pricePkr: number;
  quantity: number;
  size: string;
};

const cartStorageKey = "woven-cart";

const categoryCards = [
  {
    title: "T-Shirts",
    href: "/collections/plain-essentials",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=90&w=1400&auto=format&fit=crop",
  },
  {
    title: "Hoodies",
    href: "/collections/ice-hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1400&auto=format&fit=crop",
  },
  {
    title: "Pants",
    href: "/collections/light-pants",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=90&w=1400&auto=format&fit=crop",
  },
  {
    title: "Accessories",
    href: "/collections/winter-essentials",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=90&w=1400&auto=format&fit=crop",
  },
];

const lookbookImages = [
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=90&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=90&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=90&w=1400&auto=format&fit=crop",
];

const fallbackProductImages = [
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=90&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=90&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=90&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=90&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=90&w=1200&auto=format&fit=crop",
];

const colorSwatches = ["#090909", "#c8b8a6", "#315e42", "#9fb8c9", "#a8262f"];
const policyItems = [
  ["Pakistan Delivery", "Fast shipping across major cities"],
  ["Easy Returns", "14-day fit and size support"],
  ["Secure Checkout", "Safepay, COD, and bank transfer"],
  ["Support", "Care team replies within 24h"],
];

const journalCards = [
  {
    title: "How To Build A Minimal Everyday Wardrobe",
    tag: "Style Notes",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=90&w=1200&auto=format&fit=crop",
  },
  {
    title: "Cotton T-Shirt Weight And Fit Guide",
    tag: "Fabric",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1200&auto=format&fit=crop",
  },
  {
    title: "Hoodies, Jackets, And Layers For Real Days",
    tag: "Lookbook",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=90&w=1200&auto=format&fit=crop",
  },
];

const fitCards = [
  ["Cotton Boxy Tee", "A relaxed everyday cotton t-shirt with dropped shoulders and a heavyweight handfeel.", "/images/boxy_tee_studio.png"],
  ["Everyday Hoodie", "Soft fleece, clean rib, and enough room for winter layering in Pakistan.", "/images/everyday_hoodie_studio.png"],
  ["Cargo Pant", "Straight-leg utility pants with practical pockets and easy movement.", "/images/cargo_pant_studio.png"],
];

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function readCartLines(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((line): line is CartLine => typeof line?.slug === "string" && typeof line?.size === "string" && Number.isFinite(line?.quantity))
      .map((line) => ({ ...line, quantity: Math.max(1, Math.floor(line.quantity)) }));
  } catch {
    return [];
  }
}

function writeCartLines(lines: CartLine[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(lines));
  window.dispatchEvent(new Event("woven-cart-change"));
}

function useCartLines() {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    function syncCart() {
      setLines(readCartLines());
    }

    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("woven-cart-change", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("woven-cart-change", syncCart);
    };
  }, []);

  function addItem(product: Product, size = product.sizes[0]) {
    const current = readCartLines();
    const existing = current.find((line) => line.slug === product.slug && line.size === size);
    const next = existing
      ? current.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { slug: product.slug, size, quantity: 1 }];

    writeCartLines(next);
    window.dispatchEvent(new CustomEvent("woven-toast", { detail: `${product.name} added to cart` }));
  }

  function updateItem(slug: string, size: string, quantity: number, productName?: string) {
    const next = readCartLines()
      .map((line) => line.slug === slug && line.size === size ? { ...line, quantity } : line)
      .filter((line) => line.quantity > 0);

    writeCartLines(next);

    if (quantity === 0 && productName) {
      window.dispatchEvent(new CustomEvent("woven-toast", { detail: `${productName} removed from cart` }));
    }
  }

  function clearCart() {
    writeCartLines([]);
  }

  return { lines, addItem, updateItem, clearCart };
}

function useCartCount() {
  const { lines } = useCartLines();
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

function resolveCartProducts(catalog: CatalogData, lines: CartLine[]): CartProduct[] {
  return lines
    .map((line) => {
      const product = getProducts(catalog).find((item) => item.slug === line.slug);
      if (!product) return null;
      return { ...product, cartQuantity: line.quantity, cartSize: line.size };
    })
    .filter((product): product is CartProduct => Boolean(product));
}

function compactPrice(price: string) {
  return price.replace("PKR", "Rs.");
}

function getCollectionFromProduct(catalog: CatalogData, product: Product) {
  return catalog.collections.find((collection) => collection.slug === product.collection);
}

function getProducts(catalog: CatalogData, limit?: number) {
  const products = catalog.products.length ? catalog.products : fallbackCatalog.products;
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

function getThemeCollections(catalog: CatalogData, themeId: ThemeId) {
  const matching = catalog.collections.filter((collection) => collection.theme === themeId);
  return matching.length ? matching : catalog.collections.slice(0, 4);
}

function imageForProduct(product: Product, index = 0) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (product.imagePath && supabaseUrl) {
    return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${product.imagePath}`;
  }

  return fallbackProductImages[index % fallbackProductImages.length];
}

function ButtonLink({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <Link className={`woven-btn ${variant === "light" ? "woven-btn-light" : "woven-btn-dark"}`} href={href}>
      {children}
    </Link>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    function handleToast(e: Event) {
      const customEvent = e as CustomEvent<string>;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: customEvent.detail }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
    window.addEventListener("woven-toast", handleToast);
    return () => window.removeEventListener("woven-toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="woven-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="woven-toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();

  return (
    <header className="woven-nav">
      <nav className="woven-shell woven-nav-inner">
        <button className="woven-menu" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
        </button>
        <Link className="woven-logo" href="/">
          WOVEN
        </Link>
        <div className="woven-nav-center">
          <div className="woven-nav-links">
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/about">About</Link>
            <Link href="/lookbook">Lookbook</Link>
          </div>
          <div className="woven-mega-menu">
            <div className="woven-shell woven-mega-menu-inner">
              <div className="woven-mega-col">
                <h4>SHOP</h4>
                <Link href="/shop">All Products</Link>
                <Link href="/collections/plain-essentials">T-Shirts</Link>
                <Link href="/collections/ice-hoodies">Hoodies</Link>
                <Link href="/collections/light-pants">Pants</Link>
                <Link href="/collections/winter-essentials">Accessories</Link>
              </div>
              <div className="woven-mega-col">
                <h4>COLLECTIONS</h4>
                <Link href="/collections/plain-essentials">Plain Essentials</Link>
                <Link href="/collections/formal-edit">Formal Edit</Link>
                <Link href="/collections/sky-t-shirts">Sky T-Shirts</Link>
                <Link href="/collections/cold-air-jackets">Cold Air Jackets</Link>
                <Link href="/collections/summer-sets">Summer Sets</Link>
              </div>
              <div className="woven-mega-col">
                <h4>INFORMATION</h4>
                <Link href="/lookbook">Lookbook</Link>
                <Link href="/size-guide">Size Guide</Link>
                <Link href="/legal/returns">Shipping &amp; Returns</Link>
                <Link href="/faq">FAQs</Link>
              </div>
              <div className="woven-mega-col woven-mega-image">
                <Image
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400&h=300"
                  alt="New Arrivals clothing edit - Woven"
                  width={400}
                  height={300}
                  sizes="(max-width: 900px) 100vw, 25vw"
                />
                <h4>NEW ARRIVALS</h4>
                <Link href="/collections">Explore Now &rarr;</Link>
                <div className="woven-menu-sale-banner">{SALE_TEXT}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="woven-nav-actions" aria-label="Store actions">
          <Link href="/search" aria-label="Search">
            <span className="woven-icon woven-icon-search" />
          </Link>
          <Link href="/account/wishlist" aria-label="Account">
            <span className="woven-icon woven-icon-user" />
          </Link>
          <Link href="/cart" aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`} style={{ position: "relative" }}>
            <span className="woven-icon woven-icon-bag" />
            {cartCount > 0 && <span className="woven-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>
      {open && (
        <div className="woven-mobile-panel">
          {["Shop", "Collections", "About", "Lookbook", "Search", "Cart"].map((item) => (
            <Link
              key={item}
            href={item === "Shop" ? "/shop" : item === "Lookbook" ? "/lookbook" : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

const TRUST_VALUES = [
  {
    title: "Premium Quality",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
    )
  },
  {
    title: "Secure Payments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )
  },
  {
    title: "Sustainable Fabrics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
    )
  },
  {
    title: "Ethically Crafted",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    )
  }
];

function TrustStrip() {
  return (
    <section className="woven-trust">
      {TRUST_VALUES.map(({ title, icon }) => (
        <div key={title}>
          {icon}
          <span>{title}</span>
        </div>
      ))}
    </section>
  );
}

function Hero() {
  return (
    <section className="woven-hero">
      <div className="woven-hero-media" />
      <div className="woven-shell woven-hero-content">
        <h1>
          Woven
          <br />
          Clothing
          <br />
          Essentials.
        </h1>
        <p>Minimal clothing in Pakistan for everyday tees, pants, hoodies, jackets, and seasonal layers.</p>
        <div className="woven-hero-actions">
          <ButtonLink href="/shop">Shop Clothing</ButtonLink>
          <ButtonLink href="/about" variant="light">
            About Woven
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function CollectionsShowcase() {
  return (
    <section className="woven-section woven-shell">
      <div className="woven-section-heading woven-centered">
        <h2>Shop Woven Collections</h2>
        <p>Theme-led clothing essentials for daily wear, warm days, and winter layering.</p>
      </div>
      <div className="woven-category-grid">
        {categoryCards.map((card) => (
          <Link key={card.title} href={card.href} className="woven-category-card">
            <Image
              src={card.image}
              alt={`${card.title} collection - Woven`}
              width={700}
              height={900}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <span className="woven-image-shade" />
            <strong>{card.title}</strong>
            <small>Shop Now</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromoRail() {
  return (
    <section className="woven-promo-rail" aria-label="Store benefits">
      <div>
        {[...policyItems, ...policyItems].map(([title, copy], index) => (
          <span key={`${title}-${index}`}>
            <strong>{title}</strong>
            {copy}
          </span>
        ))}
      </div>
    </section>
  );
}

export function ProductArtwork({ product, tall = false, index = 0 }: { product: Product; tall?: boolean; index?: number }) {
  const [failed, setFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    const mainImg = failed ? fallbackProductImages[index % fallbackProductImages.length] : imageForProduct(product, index);
    const img2 = fallbackProductImages[(index + 1) % fallbackProductImages.length];
    const img3 = fallbackProductImages[(index + 2) % fallbackProductImages.length];
    return [mainImg, img2, img3];
  }, [product, index, failed]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered) {
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setTimeout(() => setCurrentIndex(0), 0);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, currentIndex, images.length]);

  return (
    <div 
      className={`woven-product-art ${tall ? "woven-product-art-tall" : ""} woven-product-slider`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="woven-product-slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`${product.imageAlt || product.name} - view ${i + 1}`}
            width={900}
            height={1200}
            sizes={tall ? "(max-width: 900px) 100vw, 42vw" : "(max-width: 768px) 50vw, 25vw"}
            priority={tall && i === 0}
            loading={tall && i === 0 ? "eager" : "lazy"}
            onError={() => i === 0 && setFailed(true)}
          />
        ))}
      </div>
      
      {isHovered && (
        <div className="woven-slider-indicators" style={{ alignItems: 'flex-end', bottom: 0, paddingBottom: '8px' }}>
           {images.map((_, i) => (
             <div 
               key={i}
               style={{ flex: 1, padding: '12px 0', cursor: 'pointer' }}
               onPointerDown={(e) => e.stopPropagation()}
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 setCurrentIndex(i);
               }}
             >
               <div className={`woven-slider-indicator ${i === currentIndex ? 'active' : i < currentIndex ? 'viewed' : ''}`} style={{ width: '100%' }}>
                 <div className="woven-slider-indicator-fill" />
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, collection, index = 0 }: { product: Product; collection?: Collection; index?: number }) {
  const { addItem } = useCartLines();

  return (
    <article className="woven-product-card">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <ProductArtwork product={product} index={index} />
      </Link>
      <div className="woven-product-meta">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
        <span>{compactPrice(product.price)}</span>
        <div className="woven-swatches" aria-label={`${collection?.title ?? "Woven"} color options`}>
          {colorSwatches.slice(0, 3 + (index % 3)).map((color) => (
            <i key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <button className="woven-card-add" type="button" onClick={() => addItem(product, product.sizes.includes("M") ? "M" : product.sizes[0])}>
          Quick Add
        </button>
      </div>
    </article>
  );
}

function Bestsellers({ catalog }: { catalog: CatalogData }) {
  const products = getProducts(catalog, 4);

  return (
    <section className="woven-section woven-shell">
      <div className="woven-section-heading">
        <h2>Best Selling Essentials</h2>
        <Link href="/collections">View All</Link>
      </div>
      <div className="woven-product-grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            collection={getCollectionFromProduct(catalog, product)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedSlider({ catalog }: { catalog: CatalogData }) {
  const products = getProducts(catalog, 8);

  return (
    <section className="woven-section woven-slider-section">
      <div className="woven-shell woven-section-heading">
        <h2>New Clothing Arrivals</h2>
        <Link href="/collections">Shop The Edit</Link>
      </div>
      <div className="woven-slider" aria-label="New arrivals horizontal product slider">
        {products.map((product, index) => (
          <div className="woven-slide" key={`slide-${product.id}`}>
            <ProductCard product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function EditorialGrid() {
  return (
    <section className="woven-section woven-shell">
      <div className="woven-section-heading">
        <h2>Style And Fabric Notes</h2>
        <Link href="/lookbook">Read More</Link>
      </div>
      <div className="woven-journal-grid">
        {journalCards.map((card) => (
          <article key={card.title} className="woven-journal-card">
            <Image src={card.image} alt={`${card.title} - Woven editorial`} width={800} height={550} sizes="(max-width: 768px) 100vw, 33vw" />
            <div>
              <span>{card.tag}</span>
              <h3>{card.title}</h3>
              <Link href="/lookbook">Explore</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicePanel() {
  return (
    <section className="woven-shell woven-service-panel">
      {policyItems.map(([title, copy]) => (
        <article key={title}>
          <span className="woven-value-icon" />
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </section>
  );
}

function FitGuideBand() {
  return (
    <section className="woven-fit-band">
      <div className="woven-shell woven-fit-grid">
        <div>
          <p>Fit Guide</p>
          <h2>Everyday Fits For Tees, Hoodies, Pants, And Jackets.</h2>
        </div>
        <div className="woven-fit-cards">
          {fitCards.map(([title, copy, img]) => (
            <article key={title}>
              <div className="woven-fit-card-image">
                <Image src={img} alt={`${title} fit reference - Woven`} width={520} height={520} sizes="(max-width: 768px) 100vw, 24vw" />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutfitBuilder() {
  return (
    <section className="woven-section woven-shell">
      <div className="woven-section-heading">
        <h2>Build A Minimal Outfit</h2>
        <Link href="/shop">Shop Essentials</Link>
      </div>
      <div className="woven-outfit-builder">
        {[
          ["01", "Start With A Cotton Tee", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=90&w=1200&auto=format&fit=crop"],
          ["02", "Add A Hoodie Or Jacket", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1200&auto=format&fit=crop"],
          ["03", "Finish With Pants", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=90&w=1200&auto=format&fit=crop"],
        ].map(([number, title, image]) => (
          <Link key={number} href="/shop" className="woven-outfit-card">
            <Image src={image} alt={`${title} outfit step - Woven`} width={900} height={1100} sizes="(max-width: 768px) 100vw, 33vw" />
            <div>
              <span>{number}</span>
              <strong>{title}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReviewsStrip() {
  return null;
  /*
  return (
    <section className="woven-reviews">
      <div className="woven-shell">
        <div className="woven-section-heading">
          <h2>Worn Daily</h2>
          <Link href="/shop">Shop Favorites</Link>
        </div>
        <div className="woven-review-grid">
          {reviewCards.map(([name, copy]) => (
            <article key={name}>
              <div>★★★★★</div>
              <p>{copy}</p>
              <strong>{name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
  */
}

function StoreCta() {
  return (
    <section className="woven-store-cta woven-shell">
      <div>
        <p>Need Help Choosing?</p>
        <h2>Find Your Clothing Size, Read Delivery Details, Or Talk To Care.</h2>
      </div>
      <div>
        <Link href="/size-guide">Size Guide</Link>
        <Link href="/legal/returns">Shipping &amp; Returns</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section className="woven-lookbook">
      <div className="woven-lookbook-primary">
        <Image src={lookbookImages[0]} alt="Woven lookbook model in everyday essentials" width={1200} height={900} sizes="(max-width: 900px) 100vw, 56vw" />
        <div>
          <h2>Lookbook</h2>
          <p>Everyday outfits, cotton basics, and seasonal layers by Woven.</p>
          <ButtonLink href="/lookbook" variant="light">
            Explore Looks
          </ButtonLink>
        </div>
      </div>
      <div className="woven-lookbook-stack">
        <Image src={lookbookImages[1]} alt="Woven green tee look" width={900} height={600} sizes="(max-width: 900px) 100vw, 44vw" />
        <Image src={lookbookImages[2]} alt="Woven blue tee streetwear look" width={900} height={600} sizes="(max-width: 900px) 100vw, 44vw" />
      </div>
    </section>
  );
}

const BRAND_VALUES = [
  {
    title: "Thoughtful Design",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
    )
  },
  {
    title: "Premium Materials",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>
    )
  },
  {
    title: "Built To Last",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    )
  },
  {
    title: "Made For Every Day",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
    )
  }
];

function BrandStory() {
  return (
    <section className="woven-brand-band">
      <div className="woven-shell woven-brand-grid">
        <div className="woven-brand-copy">
          <h2>We Are Woven.</h2>
          <p>
            Woven is a Pakistani clothing brand creating minimal wardrobe essentials for daily wear, warm days,
            polished moments, and cold-weather layering.
          </p>
          <ButtonLink href="/about" variant="light">
            Our Story
          </ButtonLink>
        </div>
        <div className="woven-brand-image" />
      </div>
      <div className="woven-values woven-shell">
        {BRAND_VALUES.map(({ title, icon }) => (
          <div key={title}>
            {icon}
            <strong>{title}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="woven-newsletter">
      <div className="woven-shell woven-newsletter-inner">
        <div>
          <h2>Join The Woven List.</h2>
          <p>Get new clothing drops, size updates, and seasonal essentials first.</p>
          <form onSubmit={(event) => event.preventDefault()} className="bg-white">
            <input type="email" placeholder="Enter your email" aria-label="Email address" className="text-black" />
            <button type="submit" aria-label="Subscribe">
              <span className="woven-arrow" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer({ catalog = fallbackCatalog, activeThemeId = "classic" }: { catalog?: CatalogData; activeThemeId?: ThemeId }) {
  const collections = getThemeCollections(catalog, activeThemeId).slice(0, 5);

  return (
    <footer className="woven-footer">
      <div className="woven-shell woven-footer-grid">
        <div>
          <Link className="woven-footer-logo" href="/">
            WOVEN
          </Link>
          <p>Minimal clothing essentials in Pakistan, made for repeat wear.</p>
          <div className="woven-socials">
            <SocialLink href="https://www.instagram.com/woven.pakistan" label="Instagram" icon="instagram" />
            <SocialLink href="https://facebook.com" label="Facebook" icon="facebook" />
            <SocialLink href="https://tiktok.com" label="TikTok" icon="tiktok" />
            <SocialLink href="https://pinterest.com" label="Pinterest" icon="pinterest" />
          </div>
        </div>
        <FooterColumn title="Shop" links={[["All Products", "/shop"], ["T-Shirts", "/collections/plain-essentials"], ["Hoodies", "/collections/ice-hoodies"], ["Pants", "/collections/light-pants"], ["Accessories", "/collections/winter-essentials"]]} />
        <FooterColumn title="Collections" links={collections.map((collection) => [collection.title, `/collections/${collection.slug}`])} />
        <FooterColumn title="Information" links={[["About Us", "/about"], ["Lookbook", "/lookbook"], ["Size Guide", "/size-guide"], ["Shipping & Returns", "/legal/returns"], ["FAQs", "/faq"]]} />
        <FooterColumn title="Customer Care" links={[["Contact Us", "/contact"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"]]} />
      </div>
      <div className="woven-shell woven-footer-bottom">
        <span>© 2024 Woven. All rights reserved.</span>
        <div className="woven-payments" aria-label="Accepted payment methods">
          <PaymentIcon type="visa" />
          <PaymentIcon type="mastercard" />
          <PaymentIcon type="paypal" />
          <PaymentIcon type="applepay" />
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: "instagram" | "facebook" | "tiktok" | "pinterest" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      {icon === "instagram" && (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" />
        </svg>
      )}
      {icon === "facebook" && (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />
        </svg>
      )}
      {icon === "tiktok" && (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 4c.4 2.8 2.1 4.6 5 5v4c-1.8 0-3.5-.6-5-1.7V16a5 5 0 1 1-5-5c.4 0 .7 0 1 .1v4.2a1.7 1.7 0 1 0 1.2 1.6V4h2.8Z" />
        </svg>
      )}
      {icon === "pinterest" && (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.2 3.5a8 8 0 0 0-3 15.4c.3-1.1.8-3 .9-3.5-.2-.5-.5-1.1-.5-1.9 0-1.8 1-3.1 2.2-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.8-1.1 4.3-.3 1.3.7 2.4 2 2.4 2.3 0 4.1-2.5 4.1-6.1 0-3.2-2.3-5.4-5.6-5.4-3.8 0-6 2.9-6 5.8 0 1.2.4 2.4 1 3.1.1.1.1.2.1.4l-.4 1.6c-.1.3-.3.4-.6.2-1.6-.8-2.6-3.1-2.6-5 0-4.1 3-7.9 8.6-7.9 4.5 0 8 3.2 8 7.5 0 4.5-2.8 8.1-6.8 8.1-1.3 0-2.6-.7-3-1.5l-.8 3.1c-.3 1.1-1.1 2.5-1.6 3.4a8 8 0 1 0 3.4-22.7Z" />
        </svg>
      )}
    </a>
  );
}

function PaymentIcon({ type }: { type: "visa" | "mastercard" | "paypal" | "applepay" }) {
  return (
    <span className={`woven-payment woven-payment-${type}`}>
      {type === "visa" && "VISA"}
      {type === "mastercard" && <><i /><i /></>}
      {type === "paypal" && "PayPal"}
      {type === "applepay" && "Apple Pay"}
    </span>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`woven-footer-column ${isOpen ? "open" : ""}`}>
      <div className="woven-footer-summary" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
      </div>
      <div className="woven-footer-links">
        {links.map(([label, href]) => (
          <Link key={`${title}-${label}`} href={href}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SaleRail() {
  return (
    <section className="woven-sale-rail" aria-label="Sale announcement">
      <div>
        {Array(20).fill(SALE_TEXT).map((text, index) => (
          <span key={`sale-${index}`}>
            <strong>{text}</strong>
            <span className="woven-sale-divider">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}

export function ThemeExperience({ catalog = fallbackCatalog }: { catalog?: CatalogData; themeId?: ThemeId }) {
  return (
    <div className="woven-page">
      <Navigation />

      <main>

        <Hero />
        <TrustStrip />
        <PromoRail />
                            <SaleRail />

        <CollectionsShowcase />
        <Bestsellers catalog={catalog} />
        <FeaturedSlider catalog={catalog} />
        <FitGuideBand />
        <OutfitBuilder />
        <Lookbook />
        <EditorialGrid />
        <ReviewsStrip />
        <ServicePanel />
        <StoreCta />
        <Newsletter />
        <BrandStory />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export const HomeExperience = ThemeExperience;

export function CollectionIndexPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading woven-centered">
            <h1>Woven Clothing Collections</h1>
            <p>Shop Classic, Summer, and Winter edits across cotton tees, formal layers, hoodies, jackets, pants, and accessories.</p>
          </div>
          <div className="woven-category-grid woven-route-categories">
            {categoryCards.map((card) => (
              <Link key={card.title} href={card.href} className="woven-category-card">
                <Image src={card.image} alt={`${card.title} collection - Woven`} width={700} height={900} sizes="(max-width: 768px) 100vw, 25vw" />
                <span className="woven-image-shade" />
                <strong>{card.title}</strong>
                <small>Shop Now</small>
              </Link>
            ))}
          </div>
          <div className="woven-product-grid woven-route-products">
            {getProducts(catalog, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function ShopPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const products = getProducts(catalog, 12);

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shop-hero woven-shell">
          <div>
            <p>Online Clothing Store Pakistan</p>
            <h1>Shop Woven</h1>
            <span>Minimal clothing essentials edited by fit, fabric, season, and repeat wear.</span>
          </div>
        </section>
        <CollectionsShowcase />
        <section className="woven-shell woven-filter-bar">
          {["All", "T-Shirts", "Hoodies", "Pants", "Accessories", "New"].map((item) => (
            <Link key={item} href={item === "All" ? "/shop" : "/collections"}>
              {item}
            </Link>
          ))}
        </section>
        <section className="woven-shell woven-product-grid woven-route-products">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
          ))}
        </section>
        <OutfitBuilder />
        <ReviewsStrip />
        <ServicePanel />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function CollectionDetailPage({ catalog = fallbackCatalog, collection }: { catalog?: CatalogData; collection: Collection }) {
  const products = collection.products.length ? collection.products : getProducts(catalog, 8);

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading">
            <p>{collection.tagline}</p>
            <h1>{collection.title} - Woven Collection</h1>
          </div>
          <div className="woven-product-grid woven-route-products">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} collection={collection} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} activeThemeId={collection.theme} />
    </div>
  );
}

export function ProductDetailPage({ catalog = fallbackCatalog, product, collection }: { catalog?: CatalogData; product: Product; collection: Collection }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartLines();
  const related = getProducts(catalog, 4);

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-product-page woven-shell">
        <div className="woven-breadcrumb">
          <Link href="/">Home</Link> / <Link href={`/collections/${collection.slug}`}>{collection.title}</Link> / {product.name}
        </div>
        <section className="woven-product-detail">
          <div className="woven-thumb-rail">
            {[0, 1, 2, 3].map((item) => (
              <div key={item}>
                <ProductArtwork product={product} index={item} />
              </div>
            ))}
          </div>
          <ProductArtwork product={product} tall />
          <aside className="woven-product-info">
            <h1>{product.name}</h1>
            <p className="woven-product-price">{compactPrice(product.price)}</p>
            <div className="woven-rating">★★★★★ <span>(128)</span></div>
            <p>{product.description}</p>
            <div className="woven-option-group">
              <span>Color: Black</span>
              <div className="woven-swatches woven-swatches-large">
                {colorSwatches.map((color) => (
                  <i key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="woven-option-group">
              <span>Size:</span>
              <div className="woven-size-grid">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={selectedSize === size ? "is-active" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button className="woven-buy-button" type="button" onClick={() => {
              addItem(product, selectedSize);
              setAdded(true);
            }}>
              {added ? "Added To Cart" : "Add To Cart"}
            </button>
            <Link className="woven-buy-button woven-buy-button-light" href="/checkout/payment">
              Buy Now
            </Link>
            {["Details", "Size Guide", "Shipping & Returns"].map((item) => (
              <details key={item} className="woven-detail-row">
                <summary>{item}</summary>
                <p>{item === "Details" ? product.material : "Designed for a relaxed everyday fit with easy exchanges."}</p>
              </details>
            ))}
          </aside>
        </section>
        <section className="woven-section">
          <div className="woven-section-heading">
            <h2>You May Also Like</h2>
          </div>
          <div className="woven-product-grid">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} collection={getCollectionFromProduct(catalog, item)} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} activeThemeId={product.theme} />
    </div>
  );
}

export function LookbookPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-lookbook-page">
          <Lookbook />
        </section>
        <OutfitBuilder />
        <EditorialGrid />
        <ReviewsStrip />
        <FeaturedSlider catalog={catalog} />
        <Newsletter />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function SearchPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const [query, setQuery] = useState("");
  const products = useMemo(
    () => getProducts(catalog).filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [catalog, query],
  );

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell">
          <label className="woven-search-label" htmlFor="search">Search Woven</label>
          <input
            id="search"
            className="woven-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a product or collection"
          />
          <div className="woven-product-grid woven-route-products">
            {(query ? products : getProducts(catalog, 8)).map((product, index) => (
              <ProductCard key={product.id} product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function AboutExperience({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <BrandStory />
        <ServicePanel />
        <EditorialGrid />
        <Newsletter />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function InfoPage({ type, catalog = fallbackCatalog }: { type: "contact" | "size" | "privacy" | "terms" | "faq" | "returns"; catalog?: CatalogData }) {
  const content = {
    contact: ["Contact Woven", "Questions about sizing, delivery, wholesale, press, or a piece you have your eye on? Reach the Woven care team.", "We respond within 24 hours."],
    size: ["Size Guide", "Use these garment measurements as a starting point. Woven fits are relaxed and true to size.", "When between sizes, size up for a looser everyday fit."],
    privacy: ["Privacy Policy", "We collect only the details needed to process orders, support customers, prevent abuse, and improve the store.", "Your information is never sold."],
    terms: ["Terms & Conditions", "Orders are subject to stock availability, payment confirmation, delivery coverage, and Pakistani law.", "Using this website means accepting Woven store policies."],
    faq: ["Frequently Asked Questions", "Fast answers for sizing, orders, returns, clothing care, and Safepay payments.", "Still stuck? Contact customer care."],
    returns: ["Shipping & Returns", "Most Pakistan orders ship in 3-5 working days. Returns are accepted within 14 days for eligible unworn items.", "Keep packaging and proof of purchase."],
  }[type];

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell woven-info-layout">
          <div className="woven-info-copy">
            <p>Customer Care</p>
            <h1>{content[0]}</h1>
            <span>{content[1]}</span>
            <strong>{content[2]}</strong>
          </div>
          {type === "contact" ? <ContactForm /> : type === "size" ? <SizeGuideTable /> : <InfoCards type={type} />}
        </section>
        <ServicePanel />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

function SizeGuideTable() {
  const rows = [
    ["Tees", "S", "38", "27", "17"],
    ["Tees", "M", "40", "28", "18"],
    ["Tees", "L", "42", "29", "19"],
    ["Shirts", "S", "40", "28.5", "18"],
    ["Shirts", "M", "42", "29.5", "18.5"],
    ["Pants", "M", "32-34 waist", "40 outseam", "Straight"],
    ["Blazers", "M", "40", "29", "Natural shoulder"],
    ["Hoodies", "M", "43", "28", "Dropped shoulder"],
    ["Jackets", "M", "44", "27.5", "Layer-ready"],
    ["Accessories", "One Size", "Scarf 70 in", "Cap adjustable", "Universal"],
  ];

  return (
    <div className="woven-size-table">
      <table>
        <thead>
          <tr><th>Category</th><th>Size</th><th>Chest / Waist</th><th>Length</th><th>Fit Note</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row[0]}-${row[1]}`}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCards({ type }: { type: string }) {
  const contentByType: Record<string, string[][]> = {
    faq: [
      ["How long is delivery?", "Most Pakistan orders arrive in 3-5 working days after confirmation."],
      ["Can I exchange sizes?", "Yes. Size exchanges are accepted within 14 days if the item is unworn, unwashed, and has tags attached."],
      ["How do returns work?", "Start a return through customer care with your order number. Approved refunds are processed in 5-7 business days after inspection."],
      ["Which payments are supported?", "Safepay handles online card payments. Cash on delivery and bank transfer are available where supported."],
      ["How should I wash cotton tees?", "Wash cold with similar colors, turn garments inside out, and line dry to protect shape and print."],
      ["How should a hoodie fit?", "Woven hoodies are relaxed. Choose your usual size for easy layering or size up for an oversized look."],
      ["Do prices include tax?", "Prices are shown in PKR. Any delivery or payment charges appear before order confirmation."],
      ["Can I edit an order?", "Contact care quickly after checkout. Changes are possible before packing begins."],
      ["Do you deliver across Pakistan?", "Yes, delivery covers major Pakistani cities and expands based on courier serviceability."],
      ["Where can I ask about wholesale?", "Use the contact page and include your city, store name, and expected order quantity."],
    ],
    terms: [
      ["Orders", "Orders are confirmed after stock and payment checks. Woven may cancel unavailable or suspicious orders."],
      ["Pricing", "All prices are listed in PKR. Delivery charges and payment fees, if any, are shown during checkout."],
      ["Delivery", "Estimated delivery is 3-5 working days in major cities, with longer timelines possible during launches, sales, weather delays, or courier disruptions."],
      ["Jurisdiction", "These terms are governed by the laws of Pakistan. Disputes are subject to the competent courts of Karachi."],
    ],
    privacy: [
      ["What we collect", "We collect order details, contact information, delivery addresses, payment status, support messages, and basic site analytics."],
      ["Where data is processed", "Storefront, hosting, database, and email workflows may use Vercel, Supabase, Safepay, and email providers configured by Woven."],
      ["How data is used", "Data is used to process orders, prevent fraud, answer support requests, improve the site, and send order or marketing emails where permitted."],
      ["Your choices", "You can request correction or deletion of eligible personal data by contacting hello@woven.pk."],
    ],
    returns: [
      ["Return window", "Eligible items can be returned or exchanged within 14 days of delivery."],
      ["Condition", "Items must be unworn, unwashed, odor-free, damage-free, and returned with tags and original packaging."],
      ["How to start", "Email hello@woven.pk with your order number, item name, reason, and photos if the item arrived damaged."],
      ["Refund timing", "Approved refunds are issued within 5-7 business days after inspection. Bank timelines may vary."],
    ],
    track: [
      ["Order confirmation", "You will receive confirmation after checkout and payment review."],
      ["Tracking", "Tracking details are shared when the courier picks up your parcel."],
      ["Support", "If a parcel has not moved for 48 hours, contact care with your order number."],
    ],
  };
  const cards = contentByType[type] ?? [["01", "Clean product information and clear checkout."], ["02", "Secure payments and order confirmation."], ["03", "Support for returns, sizing and delivery questions."]];

  return (
    <div className="woven-info-cards">
      {cards.map(([title, copy]) => (
        <article key={title}>
          <h2>{title}</h2>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Message could not be sent.");
      }

      form.reset();
      setStatus("success");
      setMessage("Message sent. The Woven care team will reply within 24 hours.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  }

  return (
    <form className="woven-checkout-form woven-contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input required name="name" autoComplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input required name="email" type="email" autoComplete="email" />
      </label>
      <label className="woven-wide-field">
        <span>Subject</span>
        <input required name="subject" />
      </label>
      <label className="woven-wide-field">
        <span>Message</span>
        <textarea required name="message" rows={6} />
      </label>
      <button className="woven-buy-button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending" : "Send Message"}
      </button>
      {message && <p className={`woven-checkout-message woven-wide-field ${status === "error" ? "is-error" : "is-success"}`}>{message}</p>}
    </form>
  );
}

function CheckoutForm({ products, onOrderComplete }: { products: CartProduct[]; onOrderComplete: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<"safepay" | "cod" | "bank_transfer">("safepay");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });
  const subtotal = products.reduce((sum, product) => sum + priceToNumber(product.price) * product.cartQuantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const items: CheckoutItem[] = products.map((product) => ({
    productSlug: product.slug,
    name: product.name,
    pricePkr: priceToNumber(product.price),
    quantity: product.cartQuantity,
    size: product.cartSize,
  }));

  async function saveOrder(providerReference?: string, completeOrder = true) {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...customer,
        paymentMethod,
        providerReference,
        items,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Checkout could not be saved.");
    }

    setStatus("success");
    setMessage(`Order ${result.orderNumber} created. Payment status: ${result.paymentStatus}.`);
    if (completeOrder) {
      onOrderComplete();
    }

    return result as { orderId?: string; orderNumber: string; paymentStatus: string; totalPkr: number };
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      if (paymentMethod !== "safepay") {
        await saveOrder();
        return;
      }

      const order = await saveOrder("safepay_pending", false);

      const response = await fetch("/api/safepay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: subtotal + shipping,
          orderId: order.orderId ?? order.orderNumber,
          customerEmail: customer.email,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error ?? "Safepay checkout could not be initialized.");
      }

      window.location.href = result.checkoutUrl;
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Checkout failed.");
    }
  }

  function updateCustomer(field: keyof typeof customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="woven-checkout-grid">
      <form className="woven-checkout-form" onSubmit={handleCheckout}>
        <label>
          <span>Full name</span>
          <input required value={customer.customerName} onChange={(event) => updateCustomer("customerName", event.target.value)} />
        </label>
        <label>
          <span>Email</span>
          <input required type="email" value={customer.email} onChange={(event) => updateCustomer("email", event.target.value)} />
        </label>
        <label>
          <span>Phone</span>
          <input required value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} />
        </label>
        <label>
          <span>City</span>
          <input required value={customer.city} onChange={(event) => updateCustomer("city", event.target.value)} />
        </label>
        <label className="woven-wide-field">
          <span>Shipping address</span>
          <textarea rows={4} required value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} />
        </label>
        <div className="woven-payment-methods woven-wide-field">
          {[
            ["safepay", "Safepay"],
            ["cod", "Cash On Delivery"],
            ["bank_transfer", "Bank Transfer"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={paymentMethod === value ? "is-active" : ""}
              onClick={() => {
                setPaymentMethod(value as "safepay" | "cod" | "bank_transfer");
                setMessage("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="woven-buy-button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Preparing Checkout" : paymentMethod === "safepay" ? `Pay Rs. ${(subtotal + shipping).toLocaleString("en-PK")}` : "Place Order"}
        </button>
        {paymentMethod === "safepay" && (
          <p className="woven-payment-note woven-wide-field">
            Secured by <a href="https://getsafepay.com" target="_blank" rel="noopener noreferrer">Safepay</a>. You will be redirected to complete payment.
          </p>
        )}
        {message && <p className={`woven-checkout-message woven-wide-field ${status === "error" ? "is-error" : "is-success"}`}>{message}</p>}
      </form>
      <aside className="woven-summary">
        <h2>Order Summary</h2>
        {products.map((product, index) => (
          <div key={product.id} className="woven-summary-line">
            <ProductArtwork product={product} index={index} />
            <div>
              <strong>{product.name}</strong>
              <span>Size {product.cartSize} / Qty {product.cartQuantity}</span>
              <span>{compactPrice(product.price)}</span>
            </div>
          </div>
        ))}
        <div className="woven-summary-total">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString("en-US")}</span>
          <span>Shipping</span>
          <span>Rs. {shipping.toLocaleString("en-US")}</span>
          <strong>Total</strong>
          <strong>Rs. {(subtotal + shipping).toLocaleString("en-US")}</strong>
        </div>
      </aside>
    </div>
  );
}

export function SimpleContentPage({ type, catalog = fallbackCatalog }: { type: "about" | "cart" | "checkout" | "account" | "legal"; catalog?: CatalogData }) {
  const { lines, updateItem, clearCart } = useCartLines();
  const products = resolveCartProducts(catalog, lines);
  const isCheckout = type === "checkout";
  const title =
    type === "cart" ? "Cart Review" : type === "account" ? "Saved Pieces" : type === "legal" ? "Shipping & Returns" : "Checkout";

  if (type === "about") {
    return <AboutExperience catalog={catalog} />;
  }

  if (type === "account") {
    return <AccountPage catalog={catalog} />;
  }

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading">
            <h1>{title}</h1>
          </div>
          {isCheckout ? (
            products.length > 0 ? (
              <CheckoutForm products={products} onOrderComplete={clearCart} />
            ) : (
              <EmptyCartState />
            )
          ) : (
            <CartReview products={products} updateItem={updateItem} />
          )}
        </section>
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

function CartReview({
  products,
  updateItem,
}: {
  products: CartProduct[];
  updateItem: (slug: string, size: string, quantity: number, productName?: string) => void;
}) {
  if (products.length === 0) {
    return <EmptyCartState />;
  }

  const subtotal = products.reduce((sum, product) => sum + priceToNumber(product.price) * product.cartQuantity, 0);

  return (
    <>
      <div className="woven-menu-sale-banner" style={{ margin: "0 0 24px 0" }}>{SALE_TEXT}</div>
      <div className="woven-cart-layout">
        <div className="woven-cart-lines">
          {products.map((product, index) => (
            <article key={`${product.slug}-${product.cartSize}`} className="woven-cart-line">
              <ProductArtwork product={product} index={index} />
              <div>
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
                <span>{compactPrice(product.price)} / Size {product.cartSize}</span>
                <div className="woven-qty-control">
                  <button type="button" onClick={() => updateItem(product.slug, product.cartSize, product.cartQuantity - 1, product.name)}>-</button>
                  <strong>{product.cartQuantity}</strong>
                  <button type="button" onClick={() => updateItem(product.slug, product.cartSize, product.cartQuantity + 1, product.name)}>+</button>
                  <button type="button" onClick={() => updateItem(product.slug, product.cartSize, 0, product.name)}>Remove</button>
                </div>
              </div>
              <strong>Rs. {(priceToNumber(product.price) * product.cartQuantity).toLocaleString("en-US")}</strong>
            </article>
          ))}
        </div>
        <aside className="woven-cart-summary">
          <h2>Cart Total</h2>
          <div><span>Subtotal</span><strong>Rs. {subtotal.toLocaleString("en-US")}</strong></div>
          <div><span>Shipping</span><strong>Calculated at checkout</strong></div>
          <Link className="woven-buy-button" href="/checkout/payment">Checkout</Link>
          <Link className="woven-buy-button woven-buy-button-light" href="/shop">Continue Shopping</Link>
        </aside>
      </div>
    </>
  );
}

function EmptyCartState() {
  return (
    <div className="woven-empty-state">
      <h2>Your Cart Is Empty</h2>
      <p>Add a tee, hoodie, pant, or accessory to start checkout.</p>
      <Link className="woven-btn woven-btn-dark" href="/shop">Shop Now</Link>
    </div>
  );
}

export function AccountPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const [status, setStatus] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");

    if (accessToken) {
      window.localStorage.setItem("woven-auth-token", accessToken);
      window.history.replaceState(null, "", window.location.pathname);
      setTimeout(() => setStatus("Google login connected."), 0);
    }

    const token = accessToken ?? window.localStorage.getItem("woven-auth-token");
    if (!token) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) return;

    fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.ok ? response.json() : null)
      .then((user) => {
        if (user?.email) {
          setSessionEmail(user.email);
        }
      })
      .catch(() => undefined);
  }, []);

  function signInWithGoogle() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      setStatus("Supabase URL is missing. Add NEXT_PUBLIC_SUPABASE_URL before using Google login.");
      return;
    }

    const redirectTo = `${window.location.origin}/account/wishlist`;
    const authUrl = new URL(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize`);
    authUrl.searchParams.set("provider", "google");
    authUrl.searchParams.set("redirect_to", redirectTo);
    window.location.assign(authUrl.toString());
  }

  function signOut() {
    window.localStorage.removeItem("woven-auth-token");
    setSessionEmail("");
    setStatus("Signed out.");
  }

  return (
    <div className="woven-page">
      <Navigation />
      <main className="woven-route-main">
        <section className="woven-shell woven-account-layout">
          <div>
            <p>Account</p>
            <h1>Sign In To Woven.</h1>
            <span>{sessionEmail ? `Signed in as ${sessionEmail}.` : "Use Google login to manage saved pieces, checkout details, and order updates."}</span>
            {sessionEmail ? (
              <button className="woven-google-button" type="button" onClick={signOut}>
                Sign Out
              </button>
            ) : (
              <button className="woven-google-button" type="button" onClick={signInWithGoogle}>
                <span>G</span>
                Continue With Google
              </button>
            )}
            {status && <p className={`woven-checkout-message ${status.includes("missing") ? "is-error" : "is-success"}`}>{status}</p>}
          </div>
          <div className="woven-product-grid">
            {getProducts(catalog, 2).map((product, index) => (
              <ProductCard key={product.id} product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
            ))}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}
