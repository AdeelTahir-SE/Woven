"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  fallbackCatalog,
  type CatalogData,
  type Collection,
  type Product,
  type Theme,
  type ThemeId,
} from "@/lib/woven-data";

type CartProduct = Product & { cartQuantity: number; cartSize: string };
type CheckoutItem = {
  productSlug: string;
  name: string;
  pricePkr: number;
  quantity: number;
  size: string;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

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
  ["Free Shipping", "On orders over Rs. 7,500"],
  ["Easy Returns", "14-day fit guarantee"],
  ["Secure Checkout", "Cards, COD and wallets"],
  ["Support", "Care team replies within 24h"],
];

const journalCards = [
  {
    title: "How To Build A Quiet Uniform",
    tag: "Style Notes",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=90&w=1200&auto=format&fit=crop",
  },
  {
    title: "The Everyday Weight Guide",
    tag: "Fabric",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1200&auto=format&fit=crop",
  },
  {
    title: "Four Fits For Real Days",
    tag: "Lookbook",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=90&w=1200&auto=format&fit=crop",
  },
];

const fitCards = [
  ["Boxy Tee", "Dropped shoulder, heavyweight handfeel, relaxed body."],
  ["Everyday Hoodie", "Soft fleece, clean rib, roomy enough for layering."],
  ["Cargo Pant", "Straight leg, practical pockets, easy movement."],
];

const reviewCards = [
  ["Ayaan", "The tee weight is exactly right. Heavy, but still wearable every day."],
  ["Maha", "Clean packaging, fast delivery, and the hoodie fit was spot on."],
  ["Zain", "The product page sizing helped. I ordered M and it fits perfectly."],
];
const themeHref: Record<ThemeId, string> = {
  classic: "/",
  summer: "/collections",
  winter: "/drops",
};

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function compactPrice(price: string) {
  return price.replace("PKR", "Rs.");
}

function getTheme(catalog: CatalogData, themeId: ThemeId) {
  return catalog.themes.find((theme) => theme.id === themeId) ?? catalog.themes[0] ?? fallbackCatalog.themes[0];
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

function Navigation({ cartCount = 1 }: { activeTheme?: Theme; cartCount?: number }) {
  const [open, setOpen] = useState(false);

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
        <div className="woven-nav-links">
          <Link href="/shop">Shop</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/about">About</Link>
          <Link href="/lookbook">Lookbook</Link>
        </div>
        <div className="woven-nav-actions" aria-label="Store actions">
          <Link href="/search" aria-label="Search">
            <span className="woven-icon woven-icon-search" />
          </Link>
          <Link href="/account/wishlist" aria-label="Account">
            <span className="woven-icon woven-icon-user" />
          </Link>
          <Link href="/cart" aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
            <span className="woven-icon woven-icon-bag" />
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

function TrustStrip() {
  return (
    <section className="woven-trust">
      {["Premium Quality", "Secure Payments", "Easy Returns", "Worldwide Shipping"].map((item) => (
        <div key={item}>
          <span className="woven-trust-icon" />
          <span>{item}</span>
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
          Built For
          <br />
          Every Day.
          <br />
          Made To Last.
        </h1>
        <p>Timeless essentials. Elevated everyday.</p>
        <div className="woven-hero-actions">
          <ButtonLink href="/collections">Shop Now</ButtonLink>
          <ButtonLink href="/about" variant="light">
            Explore
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
        <h2>Shop Collections</h2>
        <p>Find your fit. Own your style.</p>
      </div>
      <div className="woven-category-grid">
        {categoryCards.map((card) => (
          <Link key={card.title} href={card.href} className="woven-category-card">
            <img src={card.image} alt={`${card.title} collection`} />
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
  const image = failed ? fallbackProductImages[index % fallbackProductImages.length] : imageForProduct(product, index);

  return (
    <div className={`woven-product-art ${tall ? "woven-product-art-tall" : ""}`}>
      <img src={image} alt={product.imageAlt || product.name} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

export function ProductCard({ product, collection, index = 0 }: { product: Product; collection?: Collection; index?: number }) {
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
      </div>
    </article>
  );
}

function Bestsellers({ catalog }: { catalog: CatalogData }) {
  const products = getProducts(catalog, 4);

  return (
    <section className="woven-section woven-shell">
      <div className="woven-section-heading">
        <h2>Bestsellers</h2>
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
        <h2>New Arrivals</h2>
        <Link href="/collections">Swipe The Edit</Link>
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
        <h2>Editorial Notes</h2>
        <Link href="/lookbook">Read More</Link>
      </div>
      <div className="woven-journal-grid">
        {journalCards.map((card) => (
          <article key={card.title} className="woven-journal-card">
            <img src={card.image} alt={card.title} />
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
          <h2>Made To Move Through Real Days.</h2>
        </div>
        <div className="woven-fit-cards">
          {fitCards.map(([title, copy]) => (
            <article key={title}>
              <span className="woven-value-icon" />
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
        <h2>Build The Fit</h2>
        <Link href="/shop">Shop The Set</Link>
      </div>
      <div className="woven-outfit-builder">
        {[
          ["01", "Start With A Tee", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=90&w=1200&auto=format&fit=crop"],
          ["02", "Add A Layer", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=90&w=1200&auto=format&fit=crop"],
          ["03", "Finish With Pants", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=90&w=1200&auto=format&fit=crop"],
        ].map(([number, title, image]) => (
          <Link key={number} href="/shop" className="woven-outfit-card">
            <img src={image} alt={title} />
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
}

function StoreCta() {
  return (
    <section className="woven-store-cta woven-shell">
      <div>
        <p>Need Help Choosing?</p>
        <h2>Find Your Size, Track Your Order, Or Talk To Care.</h2>
      </div>
      <div>
        <Link href="/size-guide">Size Guide</Link>
        <Link href="/track-order">Track Order</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section className="woven-lookbook">
      <div className="woven-lookbook-primary">
        <img src={lookbookImages[0]} alt="Woven lookbook model in everyday essentials" />
        <div>
          <h2>Lookbook</h2>
          <p>Real fits. Real people.</p>
          <ButtonLink href="/drops" variant="light">
            Explore Looks
          </ButtonLink>
        </div>
      </div>
      <div className="woven-lookbook-stack">
        <img src={lookbookImages[1]} alt="Woven green tee look" />
        <img src={lookbookImages[2]} alt="Woven blue tee streetwear look" />
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="woven-brand-band">
      <div className="woven-shell woven-brand-grid">
        <div className="woven-brand-copy">
          <h2>We Are Woven.</h2>
          <p>
            Born from a love for simplicity and quality. Woven creates timeless essentials that fit into your life and
            elevate your everyday.
          </p>
          <ButtonLink href="/about" variant="light">
            Our Story
          </ButtonLink>
        </div>
        <div className="woven-brand-image" />
      </div>
      <div className="woven-values woven-shell">
        {["Thoughtful Design", "Premium Materials", "Built To Last", "Made For Every Day"].map((value) => (
          <div key={value}>
            <span className="woven-value-icon" />
            <strong>{value}</strong>
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
          <h2>Stay In The Loop.</h2>
          <p>New drops, exclusive offers and more.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
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
          <p>Timeless essentials. Elevated everyday.</p>
          <div className="woven-socials">
            <SocialLink href="https://instagram.com" label="Instagram" icon="instagram" />
            <SocialLink href="https://facebook.com" label="Facebook" icon="facebook" />
            <SocialLink href="https://tiktok.com" label="TikTok" icon="tiktok" />
            <SocialLink href="https://pinterest.com" label="Pinterest" icon="pinterest" />
          </div>
        </div>
        <FooterColumn title="Shop" links={[["All Products", "/shop"], ["T-Shirts", "/collections/plain-essentials"], ["Hoodies", "/collections/ice-hoodies"], ["Pants", "/collections/light-pants"], ["Accessories", "/collections/winter-essentials"]]} />
        <FooterColumn title="Collections" links={collections.map((collection) => [collection.title, `/collections/${collection.slug}`])} />
        <FooterColumn title="Information" links={[["About Us", "/about"], ["Lookbook", "/lookbook"], ["Size Guide", "/size-guide"], ["Shipping & Returns", "/legal/returns"], ["FAQs", "/faq"]]} />
        <FooterColumn title="Customer Care" links={[["Contact Us", "/contact"], ["Track Order", "/track-order"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"]]} />
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
  return (
    <div className="woven-footer-column">
      <h3>{title}</h3>
      {links.map(([label, href]) => (
        <Link key={`${title}-${label}`} href={href}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export function LogoMark({ logo, size = "h-20 w-20", className = "" }: { logo: number; size?: string; className?: string }) {
  return <span aria-hidden="true" className={`woven-logo-mark ${size} ${className}`}>{String(logo).padStart(2, "0")}</span>;
}

export function ThemeExperience({ catalog = fallbackCatalog }: { catalog?: CatalogData; themeId?: ThemeId }) {
  return (
    <div className="woven-page">
      <Navigation cartCount={1} />
      <main>
        <Hero />
        <TrustStrip />
        <PromoRail />
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
      <Navigation cartCount={1} />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading woven-centered">
            <h1>Shop Collections</h1>
            <p>Find your fit. Own your style.</p>
          </div>
          <div className="woven-category-grid woven-route-categories">
            {categoryCards.map((card) => (
              <Link key={card.title} href={card.href} className="woven-category-card">
                <img src={card.image} alt={`${card.title} collection`} />
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
      <Navigation cartCount={1} />
      <main className="woven-route-main">
        <section className="woven-shop-hero woven-shell">
          <div>
            <p>All Products</p>
            <h1>Shop Woven</h1>
            <span>Everyday essentials, edited by fit, fabric and repeat wear.</span>
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
      <Navigation cartCount={1} />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading">
            <p>{collection.tagline}</p>
            <h1>{collection.title}</h1>
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
  const related = getProducts(catalog, 4);

  return (
    <div className="woven-page">
      <Navigation cartCount={added ? 2 : 1} />
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
            <button className="woven-buy-button" type="button" onClick={() => setAdded(true)}>
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

export function DropsPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <div className="woven-page">
      <Navigation cartCount={1} />
      <main>
        <Lookbook />
        <Bestsellers catalog={catalog} />
        <FeaturedSlider catalog={catalog} />
        <Newsletter />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

export function LookbookPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <div className="woven-page">
      <Navigation cartCount={1} />
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
      <Navigation cartCount={1} />
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
      <Navigation cartCount={1} />
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

export function InfoPage({ type, catalog = fallbackCatalog }: { type: "contact" | "track" | "size" | "privacy" | "terms" | "faq" | "returns"; catalog?: CatalogData }) {
  const content = {
    contact: ["Contact Us", "Questions about sizing, delivery or a piece you have your eye on? Reach the Woven care team.", "hello@woven.pk"],
    track: ["Track Order", "Enter your order email and number to follow your delivery status.", "Tracking opens after your order is confirmed."],
    size: ["Size Guide", "Use these measurements as a starting point. Woven fits are relaxed and true to size.", "When between sizes, size up for a looser streetwear fit."],
    privacy: ["Privacy Policy", "We collect only the details needed to process orders, support customers and improve the store.", "Your information is never sold."],
    terms: ["Terms & Conditions", "Orders are subject to stock availability, payment confirmation and delivery coverage.", "Using this website means accepting Woven store policies."],
    faq: ["FAQs", "Fast answers for sizing, orders, returns and payments.", "Still stuck? Contact customer care."],
    returns: ["Shipping & Returns", "Most orders ship in 3-5 working days. Returns are accepted within 14 days for unworn items.", "Keep packaging and proof of purchase."],
  }[type];

  return (
    <div className="woven-page">
      <Navigation cartCount={1} />
      <main className="woven-route-main">
        <section className="woven-shell woven-info-layout">
          <div className="woven-info-copy">
            <p>Customer Care</p>
            <h1>{content[0]}</h1>
            <span>{content[1]}</span>
            <strong>{content[2]}</strong>
          </div>
          {type === "size" ? <SizeGuideTable /> : <InfoCards type={type} />}
        </section>
        <ServicePanel />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

function SizeGuideTable() {
  return (
    <div className="woven-size-table">
      <table>
        <thead>
          <tr><th>Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr>
        </thead>
        <tbody>
          {[
            ["XS", "34-36", "28-30", "27"],
            ["S", "36-38", "30-32", "28"],
            ["M", "38-40", "32-34", "29"],
            ["L", "40-42", "34-36", "30"],
            ["XL", "42-44", "36-38", "31"],
          ].map((row) => (
            <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCards({ type }: { type: string }) {
  const cards =
    type === "faq"
      ? [["How long is delivery?", "Most orders arrive in 3-5 working days."], ["Can I exchange sizes?", "Yes, within 14 days if unworn."], ["Do you offer COD?", "Yes, card and cash on delivery are supported."]]
      : [["01", "Clean product information and clear checkout."], ["02", "Secure payments and order confirmation."], ["03", "Support for returns, sizing and delivery questions."]];

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

function CheckoutForm({ products }: { products: CartProduct[] }) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank_transfer">("card");
  const [clientSecret, setClientSecret] = useState("");
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

  async function saveOrder(providerReference?: string) {
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
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      if (paymentMethod !== "card") {
        await saveOrder();
        return;
      }

      if (!stripePublishableKey || !stripePromise) {
        throw new Error("Stripe publishable key is missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card payments.");
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const result = await response.json();

      if (!response.ok || !result.clientSecret) {
        throw new Error(result.error ?? "Card payment could not be initialized.");
      }

      setClientSecret(result.clientSecret);
      setStatus("idle");
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
            ["card", "Card"],
            ["cod", "Cash On Delivery"],
            ["bank_transfer", "Bank Transfer"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={paymentMethod === value ? "is-active" : ""}
              onClick={() => {
                setPaymentMethod(value as "card" | "cod" | "bank_transfer");
                setClientSecret("");
                setMessage("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="woven-buy-button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Preparing Checkout" : paymentMethod === "card" ? "Continue To Card Payment" : "Place Order"}
        </button>
        {message && <p className={`woven-checkout-message woven-wide-field ${status === "error" ? "is-error" : "is-success"}`}>{message}</p>}
        {paymentMethod === "card" && clientSecret && stripePromise && (
          <div className="woven-stripe-panel woven-wide-field">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
              <StripePaymentForm items={items} customer={customer} onOrderSaved={saveOrder} />
            </Elements>
          </div>
        )}
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

function StripePaymentForm({
  items,
  customer,
  onOrderSaved,
}: {
  items: CheckoutItem[];
  customer: { customerName: string; email: string; phone: string; city: string; address: string };
  onOrderSaved: (providerReference?: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "processing" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setStatus("processing");
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirm`,
        receipt_email: customer.email,
      },
    });

    if (result.error) {
      setStatus("error");
      setMessage(result.error.message ?? "Payment failed.");
      return;
    }

    try {
      await onOrderSaved(result.paymentIntent?.id);
      setStatus("success");
      setMessage(`Payment ${result.paymentIntent?.status ?? "confirmed"}. Your order is saved.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Payment succeeded, but order save failed.");
    }
  }

  return (
    <form className="woven-stripe-form" onSubmit={handlePayment}>
      <PaymentElement />
      <button className="woven-buy-button" type="submit" disabled={!stripe || status === "processing"}>
        {status === "processing" ? "Processing Payment" : "Pay Securely"}
      </button>
      {message && <p className={`woven-checkout-message ${status === "error" ? "is-error" : "is-success"}`}>{message}</p>}
    </form>
  );
}

export function SimpleContentPage({ type, catalog = fallbackCatalog }: { type: "about" | "cart" | "checkout" | "account" | "legal"; catalog?: CatalogData }) {
  const products = getProducts(catalog, 2).map((product) => ({ ...product, cartQuantity: 1, cartSize: "M" }));
  const isCheckout = type === "checkout";
  const title =
    type === "cart" ? "Cart Review" : type === "account" ? "Saved Pieces" : type === "legal" ? "Shipping & Returns" : "Checkout";

  if (type === "about") {
    return <AboutExperience catalog={catalog} />;
  }

  return (
    <div className="woven-page">
      <Navigation cartCount={products.length} />
      <main className="woven-route-main">
        <section className="woven-shell">
          <div className="woven-section-heading">
            <h1>{title}</h1>
          </div>
          {isCheckout ? (
            <CheckoutForm products={products} />
          ) : (
            <div className="woven-product-grid woven-route-products">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} collection={getCollectionFromProduct(catalog, product)} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}
