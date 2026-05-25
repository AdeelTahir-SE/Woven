"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  fallbackCatalog,
  type CatalogData,
  type Collection,
  type Product,
  type Theme,
  type ThemeId,
} from "@/lib/woven-data";

type CartProduct = Product & { cartQuantity: number; cartSize: string };

const categoryCards = [
  {
    title: "T-Shirts",
    href: "/collections/plain-essentials",
    image: "/images/woven-assets/cat_tshirts.jpg",
  },
  {
    title: "Hoodies",
    href: "/collections/ice-hoodies",
    image: "/images/woven-assets/cat_hoodies.jpg",
  },
  {
    title: "Pants",
    href: "/collections/light-pants",
    image: "/images/woven-assets/cat_pants.jpg",
  },
  {
    title: "Accessories",
    href: "/collections/winter-essentials",
    image: "/images/woven-assets/cat_accessories.jpg",
  },
];

const lookbookImages = [
  "/images/woven-assets/lookbook_primary.jpg",
  "/images/woven-assets/lookbook_green.jpg",
  "/images/woven-assets/lookbook_blue.jpg",
];

const fallbackProductImages = [
  "/images/woven-assets/best_abstract.jpg",
  "/images/woven-assets/best_essential.jpg",
  "/images/woven-assets/best_hoodie.jpg",
  "/images/woven-assets/best_pants.jpg",
  "/images/woven-assets/product_abstract.jpg",
  "/images/woven-assets/cat_tshirts.jpg",
];

const colorSwatches = ["#090909", "#c8b8a6", "#315e42", "#9fb8c9", "#a8262f"];
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
          <Link href="/collections">Shop</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/about">About</Link>
          <Link href="/drops">Lookbook</Link>
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
              href={item === "Shop" ? "/collections" : item === "Lookbook" ? "/drops" : `/${item.toLowerCase()}`}
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
        <FooterColumn title="Shop" links={[["All Products", "/collections"], ["T-Shirts", "/collections/plain-essentials"], ["Hoodies", "/collections/ice-hoodies"], ["Pants", "/collections/light-pants"], ["Accessories", "/collections/winter-essentials"]]} />
        <FooterColumn title="Collections" links={collections.map((collection) => [collection.title, `/collections/${collection.slug}`])} />
        <FooterColumn title="Information" links={[["About Us", "/about"], ["Lookbook", "/drops"], ["Size Guide", "/products/clean-crew-tee"], ["Shipping & Returns", "/legal/returns"], ["FAQs", "/legal/returns"]]} />
        <FooterColumn title="Customer Care" links={[["Contact Us", "/about"], ["Track Order", "/account/wishlist"], ["Privacy Policy", "/legal/returns"], ["Terms & Conditions", "/legal/returns"]]} />
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
      {type === "applepay" && "Pay"}
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
        <CollectionsShowcase />
        <Bestsellers catalog={catalog} />
        <FeaturedSlider catalog={catalog} />
        <Lookbook />
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
        <Newsletter />
      </main>
      <Footer catalog={catalog} />
    </div>
  );
}

function CheckoutForm({ products }: { products: CartProduct[] }) {
  const subtotal = products.reduce((sum, product) => sum + priceToNumber(product.price) * product.cartQuantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;

  return (
    <div className="woven-checkout-grid">
      <form className="woven-checkout-form" onSubmit={(event) => event.preventDefault()}>
        {["Full name", "Email", "Phone", "City"].map((field) => (
          <label key={field}>
            <span>{field}</span>
            <input required type={field === "Email" ? "email" : "text"} />
          </label>
        ))}
        <label className="woven-wide-field">
          <span>Shipping address</span>
          <textarea rows={4} required />
        </label>
        <button className="woven-buy-button" type="submit">Place Order</button>
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
