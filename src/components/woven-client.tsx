"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fallbackCatalog, type CatalogData, type Collection, type Product } from "@/lib/woven-data";

type CartLine = {
  slug: string;
  name: string;
  price: string;
  size: string;
};

const logoPositions: Record<number, string> = {
  1: "0% 0%",
  2: "50% 0%",
  3: "100% 0%",
  4: "0% 50%",
  5: "50% 50%",
  6: "100% 50%",
  7: "0% 100%",
  8: "50% 100%",
  9: "100% 100%",
};

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function buttonClasses(variant: "primary" | "ghost" | "inverse" = "primary") {
  if (variant === "ghost") {
    return "button-base button-ghost";
  }

  if (variant === "inverse") {
    return "button-base button-inverse";
  }

  return "button-base button-primary";
}

export function LogoMark({
  logo,
  size = "h-20 w-20",
  className = "",
}: {
  logo: number;
  size?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`logo-crop inline-block overflow-hidden rounded-card border border-woven-border bg-woven-bg bg-[image:var(--logo-sheet-1)] bg-[length:300%_300%] shadow-sm ${size} ${className}`}
      style={{ backgroundPosition: logoPositions[logo] }}
    />
  );
}

export function ProductArtwork({ product, tall = false }: { product: Product; tall?: boolean }) {
  return (
    <div
      className={`product-art relative overflow-hidden bg-gradient-to-br ${product.palette} ${
        tall ? "aspect-[3/5]" : "aspect-product"
      }`}
    >
      <div className="absolute inset-x-[18%] bottom-[12%] top-[12%] border border-woven-inverse/45 bg-woven-inverse/10 backdrop-blur-[1px]" />
      <div className="absolute left-1/2 top-[18%] h-[46%] w-[38%] -translate-x-1/2 rounded-t-[42%] border border-current/20 bg-current/10" />
      <div className="absolute bottom-[18%] left-1/2 h-[30%] w-[52%] -translate-x-1/2 border border-current/20 bg-current/10" />
      <span className="absolute left-4 top-4 font-mono text-2xs uppercase tracking-[0.18em] opacity-70">
        {product.id}
      </span>
      {product.status && (
        <span className="absolute right-4 top-4 bg-woven-text px-2 py-1 font-mono text-2xs uppercase tracking-[0.16em] text-woven-inverse">
          {product.status}
        </span>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  collection,
  overlay = false,
}: {
  product: Product;
  collection?: Collection;
  overlay?: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const fontClass = collection?.fontClass ?? "font-display";
  const isDark = collection?.slug === "digital-weave" || collection?.slug === "glitch-drop";

  return (
    <article
      className={`group overflow-hidden rounded-card border transition duration-hover ease-woven hover:-translate-y-1 ${
        isDark
          ? "border-woven-inverse/15 bg-woven-inverse/5 hover:border-woven-cyan"
          : overlay
            ? "border-woven-inverse/20 bg-woven-text text-woven-inverse"
            : "border-woven-border bg-woven-bg"
      }`}
    >
      <Link href={`/products/${product.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-woven-accent">
        <ProductArtwork product={product} tall={overlay} />
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/products/${product.slug}`} className={`${fontClass} text-2xl leading-tight hover:underline`}>
              {product.name}
            </Link>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] opacity-70">{product.price}</p>
          </div>
          <button
            type="button"
            aria-label={`Save ${product.name} to wishlist`}
            className="grid h-11 w-11 place-items-center rounded-btn border border-current/20 text-lg transition duration-hover hover:scale-105 hover:border-woven-accent hover:text-woven-accent"
          >
            Save
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`grid h-10 min-w-10 place-items-center border px-3 font-mono text-2xs uppercase transition duration-hover ${
                selectedSize === size
                  ? "border-current bg-current text-woven-bg"
                  : "border-current/25 hover:border-current"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <button type="button" className={buttonClasses(isDark || overlay ? "inverse" : "primary")}>
          {product.status === "Notify Me" ? "Notify Me" : "Quick Add"}
        </button>
      </div>
    </article>
  );
}

function Navigation({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-woven-border bg-woven-bg/92 backdrop-blur-nav">
      <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-10">
        <Link href="/" className="font-display text-2xl font-medium tracking-[0.18em] text-woven-text">
          WOVEN
        </Link>
        <div className="hidden items-center gap-8 font-body text-xs uppercase tracking-[0.16em] text-woven-text md:flex">
          <Link href="/collections" className="nav-link">
            Collections
          </Link>
          <Link href="/drops" className="nav-link">
            Drops
          </Link>
          <Link href="/university" className="nav-link">
            University
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/search" aria-label="Search" className="icon-button">
            Search
          </Link>
          <Link href="/account/wishlist" aria-label="Wishlist" className="icon-button">
            Save
          </Link>
          <Link href="/cart" aria-label="Cart" className="icon-button relative">
            Bag
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center bg-woven-accent px-1 font-mono text-2xs text-woven-text">
              {cartCount}
            </span>
          </Link>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center border border-woven-border md:hidden"
        >
          <span className="h-px w-5 bg-woven-text shadow-[0_6px_0_#111111,0_-6px_0_#111111]" />
        </button>
      </nav>
      {open && (
        <div className="border-t border-woven-border bg-woven-bg p-5 md:hidden">
          <div className="grid gap-3 font-body text-lg uppercase tracking-[0.16em]">
            {["Collections", "Drops", "University", "About", "Search", "Cart"].map((item) => (
              <Link key={item} href={`/${item === "Collections" ? "collections" : item.toLowerCase()}`} onClick={() => setOpen(false)}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const letters = "Ideas Stitched Into Reality".split("");

  return (
    <section id="hero" className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-woven-bg px-5 pt-[72px] text-center text-woven-text">
      <div className="mx-auto max-w-5xl">
        <LogoMark logo={5} size="h-24 w-24" className="mb-9" />
        <h1 className="mx-auto max-w-6xl font-display text-7xl font-light leading-none md:text-9xl">
          {letters.map((letter, index) => (
            <span key={`${letter}-${index}`} className="hero-letter inline-block" style={{ animationDelay: `${index * 30}ms` }}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.28em] text-woven-muted">University Edition / SS25</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#collections-strip" className={buttonClasses("primary")}>
            Explore Collections
          </a>
          <Link href="/drops" className={buttonClasses("ghost")}>
            New Drop
          </Link>
        </div>
      </div>
      <a href="#collections-strip" aria-label="Scroll to collections" className="absolute bottom-8 left-1/2 h-20 w-px -translate-x-1/2 overflow-hidden bg-woven-border">
        <span className="thread-line block h-10 w-px bg-woven-accent" />
      </a>
    </section>
  );
}

function CollectionsStrip({ collections }: { collections: Collection[] }) {
  return (
    <section id="collections-strip" className="sticky top-[60px] z-40 border-y border-woven-border bg-woven-bg/95 py-3 backdrop-blur-nav md:top-[72px]">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 md:px-10">
        {collections.map((collection, index) => (
          <a
            key={collection.slug}
            href={`#${collection.slug}`}
            className={`shrink-0 border px-4 py-2 font-mono text-2xs uppercase tracking-[0.16em] transition duration-hover hover:bg-woven-text hover:text-woven-inverse ${
              index === 0 ? "border-woven-text bg-woven-text text-woven-inverse" : "border-woven-border text-woven-text"
            }`}
          >
            {collection.title}
          </a>
        ))}
      </div>
    </section>
  );
}

function CollectionSection({ collection }: { collection: Collection }) {
  const isDark = collection.slug === "digital-weave" || collection.slug === "glitch-drop";
  const isStreet = collection.slug === "street-stitch";
  const isGlitch = collection.slug === "glitch-drop";
  const gridClass =
    collection.slug === "minimal-edit"
      ? "grid-cols-1 md:grid-cols-3"
      : collection.slug === "digital-weave"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : collection.slug === "society"
          ? "grid-cols-1 md:grid-cols-2"
          : "grid-cols-1 md:grid-cols-2";

  return (
    <section
      id={collection.slug}
      data-collection={collection.slug}
      className={`relative overflow-hidden px-5 py-24 md:px-10 md:py-32 ${collection.bgClass} ${collection.textClass} ${
        collection.slug === "digital-weave" ? "scanlines" : ""
      } ${collection.slug === "society" ? "paper" : ""}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className={`mb-14 grid gap-8 ${collection.slug === "minimal-edit" || collection.slug === "society" ? "place-items-center text-center" : "lg:grid-cols-[220px_1fr] lg:items-end"}`}>
          <div className="space-y-5">
            <p className={`font-mono text-xs uppercase tracking-[0.24em] ${isGlitch ? "text-woven-magenta" : isDark ? "text-woven-cyan" : "text-woven-accent"}`}>
              {collection.number}
            </p>
            <LogoMark logo={collection.logo} size={collection.slug === "street-stitch" ? "h-36 w-56" : "h-28 w-28"} className={isGlitch ? "glitch-logo" : ""} />
          </div>
          <div className="space-y-5">
            {isStreet && <div className="barcode" aria-hidden="true" />}
            <h2
              className={`${collection.fontClass} ${
                isStreet ? "text-10xl md:text-11xl" : isGlitch ? "glitch-title text-8xl md:text-10xl" : "text-7xl md:text-9xl"
              } leading-none`}
              data-text={collection.displayTitle}
            >
              {collection.displayTitle}
            </h2>
            <p className={`max-w-2xl font-body text-md leading-relaxed ${isDark ? "text-woven-inverse/65" : "text-woven-muted"}`}>
              <span className="font-mono text-xs uppercase tracking-[0.18em]">{collection.tagline}</span>
              <br />
              {collection.mood}
            </p>
          </div>
        </div>
        {isGlitch && <Countdown />}
        <div className={`grid gap-5 ${gridClass}`}>
          {collection.products.map((product, index) => (
            <div key={product.id} className={collection.slug === "minimal-edit" && index === 0 ? "md:col-span-2" : ""}>
              <ProductCard product={product} collection={collection} overlay={isStreet} />
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href={`/collections/${collection.slug}`} className={buttonClasses(isDark ? "inverse" : "ghost")}>
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const target = useMemo(() => new Date("2026-06-15T17:00:00+05:00").getTime(), []);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  const remaining = now > 0 ? Math.max(target - now, 0) : 0;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining / 3_600_000) % 24);
  const minutes = Math.floor((remaining / 60_000) % 60);
  const seconds = Math.floor((remaining / 1_000) % 60);
  const parts = now > 0 ? [days, hours, minutes, seconds].map((part) => String(part).padStart(2, "0")) : ["--", "--", "--", "--"];

  return (
    <div className="mb-10 border border-woven-cyan/30 p-5 text-center">
      <p className="font-mono text-2xs uppercase tracking-[0.24em] text-woven-magenta">Drop in</p>
      <p className="mt-2 font-ibm text-5xl tabular-nums text-woven-cyan">{parts.join(" : ")}</p>
    </div>
  );
}

function UniversityBanner() {
  return (
    <section id="university-strip" className="bg-woven-text px-5 py-20 text-woven-inverse md:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent">University Program</p>
          <h2 className="mt-3 font-display text-6xl leading-tight md:text-7xl">15% Off. Always. For Students.</h2>
          <p className="mt-4 max-w-xl font-body text-md text-woven-inverse/70">Verify with your university email and keep the discount ready in your cart.</p>
        </div>
        <Link href="/university" className={buttonClasses("inverse")}>
          Verify Student Status
        </Link>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section id="brand-story" className="bg-woven-bg px-5 py-24 text-woven-text md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-display text-6xl italic leading-tight">
          &quot;We do not just make clothes. We make the uniform of curiosity.&quot;
        </p>
        <p className="mt-8 max-w-2xl font-body text-md leading-relaxed text-woven-muted">
          Woven is built for university life: presentations, studio nights, society rooms, underpass meetups, and the small rituals that make a semester feel like yours.
        </p>
        <Link href="/about" className={`${buttonClasses("ghost")} mt-8`}>
          Read Our Story
        </Link>
      </div>
    </section>
  );
}

export function Footer({ collections = fallbackCatalog.collections }: { collections?: Collection[] }) {
  return (
    <footer id="newsletter" className="bg-woven-text px-5 py-20 text-woven-inverse md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-display text-4xl italic tracking-[0.1em]">WOVEN</p>
          <p className="mt-3 max-w-xs font-body text-sm text-woven-inverse/65">Ideas Stitched Into Reality.</p>
        </div>
        <FooterColumn title="Collections" links={collections.map((collection) => [collection.title, `/collections/${collection.slug}`])} />
        <FooterColumn
          title="Info"
          links={[
            ["About", "/about"],
            ["University", "/university"],
            ["Returns", "/legal/returns"],
            ["Careers", "/about"],
          ]}
        />
        <div>
          <p className="font-display text-5xl italic">Stay In The Loop</p>
          <form className="mt-5 flex border border-woven-inverse/25" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              aria-label="Email address"
              placeholder="student@university.edu"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 font-body text-sm outline-none placeholder:text-woven-inverse/35"
            />
            <button type="submit" className="bg-woven-accent px-4 font-mono text-2xs uppercase tracking-[0.18em] text-woven-text">
              Stitch In
            </button>
          </form>
          <p className="mt-3 font-body text-xs text-woven-inverse/55">No spam. Drop alerts and early access only.</p>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-7xl border-t border-woven-inverse/15 pt-6 font-mono text-2xs uppercase tracking-[0.18em] text-woven-inverse/50">
        (c) 2025 Woven. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-[0.22em] text-woven-accent">{title}</p>
      <div className="mt-4 grid gap-3 font-body text-sm text-woven-inverse/70">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="hover:text-woven-accent">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HomeExperience({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const { collections, products } = catalog;
  const [cartLines] = useState<CartLine[]>([
    { slug: products[0].slug, name: products[0].name, price: products[0].price, size: "M" },
  ]);

  return (
    <>
      <Navigation cartCount={cartLines.length} />
      <main>
        <Hero />
        <CollectionsStrip collections={collections} />
        {collections.map((collection) => (
          <CollectionSection key={collection.slug} collection={collection} />
        ))}
        <UniversityBanner />
        <BrandStory />
      </main>
      <Footer collections={collections} />
    </>
  );
}

export function CollectionIndexPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const { collections } = catalog;

  return (
    <>
      <Navigation cartCount={1} />
      <main className="bg-woven-bg px-5 pb-24 pt-32 text-woven-text md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent">All Collections</p>
          <h1 className="mt-4 font-display text-7xl leading-none md:text-10xl">Choose Your Campus Uniform.</h1>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className={`${collection.bgClass} ${collection.textClass} min-h-80 rounded-card border border-woven-border p-6 transition duration-hover hover:-translate-y-1`}
              >
                <LogoMark logo={collection.logo} />
                <p className="mt-8 font-mono text-2xs uppercase tracking-[0.18em] opacity-65">{collection.number}</p>
                <h2 className={`${collection.fontClass} mt-2 text-6xl leading-none`}>{collection.displayTitle}</h2>
                <p className="mt-4 font-body text-sm opacity-70">{collection.mood}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer collections={collections} />
    </>
  );
}

export function CollectionDetailPage({ collection }: { collection: Collection }) {
  return (
    <>
      <Navigation cartCount={1} />
      <main className={`${collection.bgClass} ${collection.textClass} pt-[72px]`}>
        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <LogoMark logo={collection.logo} size="h-32 w-32" />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] opacity-70">{collection.tagline}</p>
            <h1 className={`${collection.fontClass} mt-4 text-8xl leading-none md:text-11xl`}>{collection.displayTitle}</h1>
            <p className="mt-6 max-w-2xl font-body text-md opacity-70">{collection.mood}</p>
          </div>
        </section>
        <section className="border-y border-current/10 px-5 py-4 md:px-10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-2xs uppercase tracking-[0.16em]">
            <div className="flex flex-wrap gap-2">
              {["Size", "Color", "Price", "Type"].map((filter) => (
                <button key={filter} type="button" className="border border-current/20 px-3 py-2 hover:border-current">
                  {filter}
                </button>
              ))}
            </div>
            <button type="button" className="border border-current/20 px-3 py-2 hover:border-current">
              Sort: Newest
            </button>
          </div>
        </section>
        <section className="px-5 py-16 md:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} collection={collection} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function ProductDetailPage({ product, collection }: { product: Product; collection: Collection }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);

  return (
    <>
      <Navigation cartCount={added ? 2 : 1} />
      <main className="bg-woven-bg px-5 pb-24 pt-32 text-woven-text md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-2xs uppercase tracking-[0.16em] text-woven-muted">
            <Link href="/">Home</Link> / <Link href={`/collections/${collection.slug}`}>{collection.title}</Link> / {product.name}
          </div>
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
              <div className="hidden gap-3 sm:grid">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="aspect-product border border-woven-border bg-woven-surface" />
                ))}
              </div>
              <div className="sticky top-28">
                <ProductArtwork product={product} tall />
              </div>
            </div>
            <aside className="space-y-7">
              <span className="inline-flex border border-woven-border px-3 py-2 font-mono text-2xs uppercase tracking-[0.16em]">{collection.title}</span>
              <div>
                <h1 className={`${collection.fontClass} text-7xl leading-none`}>{product.name}</h1>
                <p className="mt-4 font-mono text-2xl">{product.price}</p>
              </div>
              <p className="font-body text-md leading-relaxed text-woven-muted">{product.description}</p>
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-2xs uppercase tracking-[0.16em]">
                  <span>Size</span>
                  <button type="button" className="underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`grid h-11 min-w-11 place-items-center border px-3 font-mono text-xs ${
                        selectedSize === size ? "border-woven-text bg-woven-text text-woven-inverse" : "border-woven-border"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdded(true)}
                className={`${buttonClasses("primary")} w-full`}
              >
                {product.status === "Notify Me" ? "Notify Me" : "Add To Cart"}
              </button>
              {added && <p className="font-mono text-xs uppercase tracking-[0.16em] text-woven-accent">Added to cart</p>}
              {[
                ["Description", product.description],
                ["Material & Fabric", product.material],
                ["Shipping & Returns", "Ships in 3 to 5 working days. Returns accepted within 14 days if unworn."],
                ["Care Instructions", "Cold wash inside out. Dry flat. Do not bleach."],
              ].map(([title, copy]) => (
                <details key={title} className="border-t border-woven-border py-4">
                  <summary className="cursor-pointer font-mono text-2xs uppercase tracking-[0.16em]">{title}</summary>
                  <p className="mt-3 font-body text-sm leading-relaxed text-woven-muted">{copy}</p>
                </details>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function DropsPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const glitch = catalog.collections.find((collection) => collection.slug === "glitch-drop")!;
  return (
    <>
      <Navigation cartCount={1} />
      <main className="bg-woven-near-black px-5 pt-32 text-woven-inverse md:px-10">
        <div className="mx-auto max-w-7xl">
          <LogoMark logo={6} size="h-36 w-36" className="glitch-logo" />
          <h1 className="glitch-title mt-8 font-rajdhani text-10xl font-bold leading-none" data-text="Limited. Always.">
            Limited. Always.
          </h1>
          <Countdown />
          <div className="grid gap-5 pb-24 md:grid-cols-3">
            {glitch.products.map((product) => (
              <ProductCard key={product.id} product={product} collection={glitch} />
            ))}
          </div>
        </div>
      </main>
      <Footer collections={catalog.collections} />
    </>
  );
}

export function SearchPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const [query, setQuery] = useState("");
  const { collections, products } = catalog;
  const results = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <Navigation cartCount={1} />
      <main className="min-h-screen bg-woven-dark px-5 pt-32 text-woven-inverse md:px-10">
        <div className="mx-auto max-w-7xl">
          <label className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent" htmlFor="search">
            Search Woven
          </label>
          <input
            id="search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a product, collection, or mood"
            className="mt-5 w-full border-b border-woven-inverse/25 bg-transparent py-5 font-display text-6xl outline-none placeholder:text-woven-inverse/25"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(query ? results : products.slice(0, 4)).map((product) => {
              const collection = collections.find((item) => item.slug === product.collection)!;
              return <ProductCard key={product.id} product={product} collection={collection} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export function SimpleContentPage({
  type,
  catalog = fallbackCatalog,
}: {
  type: "about" | "university" | "cart" | "checkout" | "account" | "legal";
  catalog?: CatalogData;
}) {
  const { products } = catalog;
  const subtotal = products.slice(0, 2).reduce((sum, product) => sum + priceToNumber(product.price), 0);
  const title =
    type === "about"
      ? "The Uniform Of Curiosity."
      : type === "university"
        ? "Dressed For Campus. Priced For Students."
        : type === "cart"
          ? "Cart Review"
          : type === "checkout"
            ? "Checkout"
            : type === "account"
              ? "Account"
              : "Returns, Terms, And Privacy";

  return (
    <>
      <Navigation cartCount={1} />
      <main className="bg-woven-bg px-5 pb-24 pt-32 text-woven-text md:px-10">
        <section className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent">Woven</p>
          <h1 className="mt-4 max-w-4xl font-display text-7xl leading-none md:text-10xl">{title}</h1>
          {type === "cart" || type === "checkout" ? (
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="grid gap-4">
                {products.slice(0, 2).map((product) => (
                  <div key={product.id} className="grid gap-4 border border-woven-border p-4 sm:grid-cols-[120px_1fr_auto]">
                    <ProductArtwork product={product} />
                    <div>
                      <h2 className="font-display text-4xl">{product.name}</h2>
                      <p className="mt-2 font-body text-sm text-woven-muted">Size M / Quantity 1</p>
                    </div>
                    <p className="font-mono text-sm">{product.price}</p>
                  </div>
                ))}
              </div>
              <aside className="h-fit border border-woven-border p-6">
                <p className="font-mono text-2xs uppercase tracking-[0.18em]">Order Summary</p>
                <div className="mt-5 flex justify-between font-body">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString("en-US")}</span>
                </div>
                <div className="mt-3 flex justify-between font-body text-woven-accent">
                  <span>Student discount</span>
                  <span>-15%</span>
                </div>
                <Link href="/checkout/delivery" className={`${buttonClasses("primary")} mt-6 w-full`}>
                  Continue
                </Link>
              </aside>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                ["01", "Verify", "Use a university email or campus ID pattern to unlock student pricing."],
                ["02", "Choose", "Move through collections by identity, not just category."],
                ["03", "Wear", "Pieces built for lectures, studios, society rooms, and late plans."],
              ].map(([number, heading, copy]) => (
                <article key={number} className="border border-woven-border bg-woven-surface p-6">
                  <p className="font-mono text-2xs uppercase tracking-[0.18em] text-woven-accent">{number}</p>
                  <h2 className="mt-8 font-display text-5xl">{heading}</h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-woven-muted">{copy}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer collections={catalog.collections} />
    </>
  );
}
