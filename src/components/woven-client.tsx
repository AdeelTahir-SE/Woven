"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  fallbackCatalog,
  type CatalogData,
  type Collection,
  type Product,
  type Theme,
  type ThemeId,
} from "@/lib/woven-data";

type CartLine = {
  slug: string;
  name: string;
  price: string;
  pricePkr: number;
  size: string;
};

type PaymentMethod = "cod" | "bank_transfer" | "card";

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

const themeHref: Record<ThemeId, string> = {
  classic: "/themes/classic",
  summer: "/themes/summer",
  winter: "/themes/winter",
};

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function getTheme(catalog: CatalogData, themeId: ThemeId) {
  return catalog.themes.find((theme) => theme.id === themeId) ?? catalog.themes[0] ?? fallbackCatalog.themes[0];
}

function getThemeCollections(catalog: CatalogData, themeId: ThemeId) {
  return catalog.collections.filter((collection) => collection.theme === themeId);
}

function getThemeProducts(catalog: CatalogData, themeId: ThemeId) {
  return catalog.products.filter((product) => product.theme === themeId);
}

function buttonClasses(variant: "primary" | "ghost" | "inverse" = "primary") {
  if (variant === "ghost") return "button-base button-ghost";
  if (variant === "inverse") return "button-base button-inverse";
  return "button-base button-primary";
}

function storageImageUrl(path?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!path || !supabaseUrl) {
    return "";
  }

  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${path}`;
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
  const imageUrl = storageImageUrl(product.imagePath);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`product-art relative overflow-hidden bg-woven-surface ${tall ? "aspect-[3/5]" : "aspect-product"}`}>
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt={product.imageAlt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="grid h-full place-items-center p-6 text-center text-woven-muted">
          <span className="font-mono text-2xs uppercase tracking-[0.18em]">{product.imageAlt}</span>
        </div>
      )}
      <span className="absolute left-4 top-4 font-mono text-2xs uppercase tracking-[0.18em] opacity-70">{product.id}</span>
      {product.status && (
        <span className="absolute right-4 top-4 bg-woven-text px-2 py-1 font-mono text-2xs uppercase tracking-[0.16em] text-woven-inverse">
          {product.status}
        </span>
      )}
    </div>
  );
}

export function ProductCard({ product, collection }: { product: Product; collection?: Collection }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const fontClass = collection?.fontClass ?? "font-display";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-woven-border bg-white/92 text-woven-text shadow-sm backdrop-blur transition duration-hover ease-woven hover:-translate-y-1 hover:border-woven-accent">
      <Link href={`/products/${product.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-woven-accent">
        <ProductArtwork product={product} />
      </Link>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/products/${product.slug}`} className={`${fontClass} text-2xl leading-tight hover:underline`}>
              {product.name}
            </Link>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] opacity-70">{product.price}</p>
          </div>
          <button type="button" aria-label={`Save ${product.name}`} className="grid h-11 w-11 shrink-0 place-items-center border border-current/20 text-xs uppercase transition hover:border-woven-accent hover:text-woven-accent">
            Save
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`grid h-10 min-w-10 place-items-center border px-3 font-mono text-2xs uppercase transition ${
                selectedSize === size ? "border-woven-text bg-woven-text text-woven-inverse" : "border-current/25 hover:border-current"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <button type="button" className={`${buttonClasses("primary")} mt-auto`}>
          {product.status === "Notify Me" ? "Notify Me" : "Quick Add"}
        </button>
      </div>
    </article>
  );
}

function ThemeRipple({ ripple }: { ripple: { x: number; y: number; theme: ThemeId } | null }) {
  if (!ripple) return null;
  return (
    <span
      key={`${ripple.theme}-${ripple.x}-${ripple.y}`}
      className={`theme-ripple theme-ripple-${ripple.theme}`}
      style={{ left: ripple.x, top: ripple.y }}
      aria-hidden="true"
    />
  );
}

function ThemeSwitcher({
  themes,
  activeTheme,
  onThemeClick,
}: {
  themes: Theme[];
  activeTheme: Theme;
  onThemeClick: (event: React.MouseEvent<HTMLAnchorElement>, themeId: ThemeId) => void;
}) {
  return (
    <div className="theme-switcher" aria-label="Theme switcher">
      {themes.map((theme) => (
        <Link
          key={theme.id}
          href={themeHref[theme.id]}
          onClick={(event) => onThemeClick(event, theme.id)}
          aria-current={theme.id === activeTheme.id ? "page" : undefined}
          className={`theme-switcher-link ${theme.id === activeTheme.id ? "is-active" : ""}`}
        >
          <span className={`theme-switcher-orb theme-switcher-orb-${theme.id}`} aria-hidden="true" />
          {theme.label}
        </Link>
      ))}
    </div>
  );
}

function useThemeTransition(activeTheme: Theme) {
  const router = useRouter();
  const [ripple, setRipple] = useState<{ x: number; y: number; theme: ThemeId } | null>(null);

  function handleThemeClick(event: React.MouseEvent<HTMLAnchorElement>, themeId: ThemeId) {
    event.preventDefault();

    const href = themeHref[themeId];

    if (themeId === activeTheme.id) {
      return;
    }

    const radius = Math.hypot(
      Math.max(event.clientX, window.innerWidth - event.clientX),
      Math.max(event.clientY, window.innerHeight - event.clientY),
    );

    document.documentElement.style.setProperty("--theme-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--theme-y", `${event.clientY}px`);
    document.documentElement.style.setProperty("--theme-radius", `${Math.ceil(radius)}px`);

    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

    if (transitionDocument.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const transition = transitionDocument.startViewTransition(() => {
        router.push(href);
      });
      transition.finished.catch(() => undefined);
      return;
    }

    setRipple({ x: event.clientX, y: event.clientY, theme: themeId });
    window.setTimeout(() => {
      setRipple(null);
      window.location.assign(href);
    }, 420);
  }

  return { handleThemeClick, ripple };
}

function Navigation({ activeTheme, cartCount }: { activeTheme: Theme; cartCount: number }) {
  const [open, setOpen] = useState(false);
  const navTextClass = activeTheme.id === "summer" ? "text-white" : activeTheme.navTextClass;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-nav ${activeTheme.navClass}`}>
        <nav className="mx-auto flex min-h-[60px] max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-2 md:min-h-[72px] md:px-10">
          <Link href={themeHref[activeTheme.id]} className={`font-display text-2xl font-medium tracking-[0.18em] ${navTextClass}`}>
            WOVEN
          </Link>
          <div className={`hidden items-center gap-8 font-body text-xs uppercase tracking-[0.16em] md:flex ${navTextClass}`}>
            <Link href="/collections" className="nav-link">Collections</Link>
            <Link href="/drops" className="nav-link">Drops</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/search" className="icon-button">Search</Link>
            <Link href="/cart" className="icon-button relative">
              Bag
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center bg-woven-accent px-1 font-mono text-2xs text-woven-text">{cartCount}</span>
            </Link>
          </div>
          <button type="button" aria-expanded={open} aria-label="Open menu" onClick={() => setOpen((value) => !value)} className={`grid h-11 w-11 place-items-center border border-current text-xs uppercase ${navTextClass} md:hidden`}>
            Menu
          </button>
        </nav>
        {open && (
          <div className="border-t border-current/15 bg-white p-5 text-black md:hidden">
            <div className="grid gap-3 font-body text-lg uppercase tracking-[0.16em]">
              {["Collections", "Drops", "About", "Search", "Cart"].map((item) => (
                <Link key={item} href={`/${item === "Collections" ? "collections" : item.toLowerCase()}`} onClick={() => setOpen(false)}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function Hero({ theme }: { theme: Theme }) {
  return (
    <section id="hero" className={`hero-${theme.heroMedia} relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-[72px] text-center`}>
      <div className="hero-media" aria-hidden="true">
        {theme.heroMedia === "summer" && (
          <video className="hero-video" autoPlay muted loop playsInline poster="">
            <source src="/videos/themes/summer/hero-section.mp4" type="video/mp4" />
          </video>
        )}
        {theme.heroMedia === "winter" && (
          <video className="hero-video" autoPlay muted loop playsInline poster="">
            <source src="/videos/themes/winter/hero.mp4" type="video/mp4" />
          </video>
        )}
        {theme.heroMedia === "summer" && <div className="summer-sky"><span /><span /><span /></div>}
        {theme.heroMedia === "winter" && <div className="snowfall">{Array.from({ length: 34 }).map((_, index) => <i key={index} />)}</div>}
      </div>
      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="font-display text-7xl font-light leading-none md:text-11xl">{theme.heroTitle}</h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed md:text-2xl">{theme.tagline}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#collections-strip" className={buttonClasses(theme.id === "winter" ? "ghost" : "primary")}>Explore Collections</a>
          <Link href="/collections" className={buttonClasses("ghost")}>All Themes</Link>
        </div>
      </div>
    </section>
  );
}

function ThemeBar({
  catalog,
  activeTheme,
  onThemeClick,
}: {
  catalog: CatalogData;
  activeTheme: Theme;
  onThemeClick: (event: React.MouseEvent<HTMLAnchorElement>, themeId: ThemeId) => void;
}) {
  const barTextClass = activeTheme.id === "summer" ? "text-white" : activeTheme.stripTextClass;

  return (
    <section className={`theme-bar ${activeTheme.stripClass} ${barTextClass}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <p className="font-mono text-2xs uppercase tracking-[0.18em] opacity-60">Choose theme</p>
          <p className="mt-1 font-display text-3xl leading-none">{activeTheme.label}</p>
        </div>
        <ThemeSwitcher themes={catalog.themes} activeTheme={activeTheme} onThemeClick={onThemeClick} />
      </div>
    </section>
  );
}

function CollectionsStrip({ collections, theme }: { collections: Collection[]; theme: Theme }) {
  return (
    <section id="collections-strip" className={`sticky top-[60px] z-40 border-y py-3 backdrop-blur-nav md:top-[72px] ${theme.stripClass}`}>
      <div className="marquee-track">
        {[...collections, ...collections].map((collection, index) => (
          <a key={`${collection.slug}-${index}`} href={`#${collection.slug}`} className={`marquee-pill ${theme.stripTextClass}`}>
            {collection.title}
          </a>
        ))}
      </div>
    </section>
  );
}

function CollectionSection({ collection }: { collection: Collection }) {
  const gridClass = collection.products.length > 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2";

  return (
    <section id={collection.slug} className={`relative overflow-hidden px-5 py-24 md:px-10 md:py-32 ${collection.bgClass} ${collection.textClass}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[180px_1fr] lg:items-end">
          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-woven-accent">{collection.number}</p>
            <LogoMark logo={collection.logo} size="h-28 w-28" />
          </div>
          <div className="space-y-5">
            <h2 className={`${collection.fontClass} text-7xl leading-none md:text-10xl`}>{collection.displayTitle}</h2>
            <p className="max-w-2xl font-body text-md leading-relaxed opacity-75">
              <span className="font-mono text-xs uppercase tracking-[0.18em]">{collection.tagline}</span>
              <br />
              {collection.mood}
            </p>
          </div>
        </div>
        <div className={`grid gap-5 ${gridClass}`}>
          {collection.products.map((product) => <ProductCard key={product.id} product={product} collection={collection} />)}
        </div>
        <div className="mt-12">
          <Link href={`/collections/${collection.slug}`} className={buttonClasses("ghost")}>View Full Collection</Link>
        </div>
      </div>
    </section>
  );
}

function BrandStory({ theme }: { theme: Theme }) {
  return (
    <section id="brand-story" className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-display text-6xl italic leading-tight">&ldquo;Clothes with a point of view, made for real days.&rdquo;</p>
        <p className="mt-8 max-w-2xl font-body text-md leading-relaxed opacity-70">
          Woven builds theme-led clothing worlds for everyday dressing, from refined classics to warm-weather ease and cold-weather layers.
        </p>
        <p className="mt-4 font-mono text-2xs uppercase tracking-[0.18em] opacity-60">Active theme: {theme.label} / Accent: {theme.accentName}</p>
      </div>
    </section>
  );
}

export function Footer({ catalog = fallbackCatalog, activeThemeId = "classic" }: { catalog?: CatalogData; activeThemeId?: ThemeId }) {
  const collections = getThemeCollections(catalog, activeThemeId);
  return (
    <footer id="newsletter" className="bg-woven-text px-5 py-20 text-woven-inverse md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <p className="font-display text-4xl italic tracking-[0.1em]">WOVEN</p>
          <p className="mt-3 max-w-xs font-body text-sm text-woven-inverse/65">Ideas Stitched Into Reality.</p>
        </div>
        <FooterColumn title="Themes" links={catalog.themes.map((theme) => [theme.label, themeHref[theme.id]])} />
        <FooterColumn title="Collections" links={collections.map((collection) => [collection.title, `/collections/${collection.slug}`])} />
        <div>
          <p className="font-display text-5xl italic">Stay In The Loop</p>
          <form className="mt-5 flex border border-woven-inverse/25" onSubmit={(event) => event.preventDefault()}>
            <input type="email" aria-label="Email address" placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 font-body text-sm outline-none placeholder:text-woven-inverse/35" />
            <button type="submit" className="bg-woven-accent px-4 font-mono text-2xs uppercase tracking-[0.18em] text-woven-text">Join</button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-[0.22em] text-woven-accent">{title}</p>
      <div className="mt-4 grid gap-3 font-body text-sm text-woven-inverse/70">
        {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-woven-accent">{label}</Link>)}
      </div>
    </div>
  );
}

export function ThemeExperience({ catalog = fallbackCatalog, themeId = "classic" }: { catalog?: CatalogData; themeId?: ThemeId }) {
  const activeTheme = getTheme(catalog, themeId);
  const collections = getThemeCollections(catalog, activeTheme.id);
  const products = getThemeProducts(catalog, activeTheme.id);
  const [cartLines] = useState<CartLine[]>(products[0] ? [{ slug: products[0].slug, name: products[0].name, price: products[0].price, pricePkr: priceToNumber(products[0].price), size: "M" }] : []);
  const { handleThemeClick, ripple } = useThemeTransition(activeTheme);

  return (
    <div className={activeTheme.pageClass} data-theme={activeTheme.id}>
      <Navigation activeTheme={activeTheme} cartCount={cartLines.length} />
      <main>
        <Hero theme={activeTheme} />
        <ThemeBar catalog={catalog} activeTheme={activeTheme} onThemeClick={handleThemeClick} />
        <CollectionsStrip collections={collections} theme={activeTheme} />
        {collections.map((collection) => <CollectionSection key={collection.slug} collection={collection} />)}
        <BrandStory theme={activeTheme} />
      </main>
      <Footer catalog={catalog} activeThemeId={activeTheme.id} />
      <ThemeRipple ripple={ripple} />
    </div>
  );
}

export const HomeExperience = ThemeExperience;

export function CollectionIndexPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  return (
    <>
      <Navigation activeTheme={getTheme(catalog, "classic")} cartCount={1} />
      <main className="bg-woven-bg px-5 pb-24 pt-32 text-woven-text md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent">All Theme Collections</p>
          <h1 className="mt-4 font-display text-7xl leading-none md:text-10xl">Choose A Woven World.</h1>
          {catalog.themes.map((theme) => (
            <section key={theme.id} className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-5xl">{theme.label}</h2>
                  <p className="mt-2 max-w-2xl opacity-70">{theme.tagline}</p>
                </div>
                <Link href={themeHref[theme.id]} className={buttonClasses("ghost")}>Open Theme</Link>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {getThemeCollections(catalog, theme.id).map((collection) => (
                  <Link key={collection.slug} href={`/collections/${collection.slug}`} className={`${collection.bgClass} ${collection.textClass} min-h-72 rounded-card border border-current/15 p-6 transition hover:-translate-y-1`}>
                    <LogoMark logo={collection.logo} />
                    <p className="mt-8 font-mono text-2xs uppercase tracking-[0.18em] opacity-65">{collection.number}</p>
                    <h3 className={`${collection.fontClass} mt-2 text-5xl leading-none`}>{collection.displayTitle}</h3>
                    <p className="mt-4 font-body text-sm opacity-70">{collection.mood}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}

export function CollectionDetailPage({ catalog = fallbackCatalog, collection }: { catalog?: CatalogData; collection: Collection }) {
  const activeTheme = getTheme(catalog, collection.theme);
  return (
    <div className={activeTheme.pageClass}>
      <Navigation activeTheme={activeTheme} cartCount={1} />
      <main className={`${collection.bgClass} ${collection.textClass} pt-[72px]`}>
        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <LogoMark logo={collection.logo} size="h-32 w-32" />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] opacity-70">{activeTheme.label} / {collection.tagline}</p>
            <h1 className={`${collection.fontClass} mt-4 text-8xl leading-none md:text-11xl`}>{collection.displayTitle}</h1>
            <p className="mt-6 max-w-2xl font-body text-md opacity-70">{collection.mood}</p>
          </div>
        </section>
        <section className="px-5 py-16 md:px-10">
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collection.products.map((product) => <ProductCard key={product.id} product={product} collection={collection} />)}
          </div>
        </section>
      </main>
      <Footer catalog={catalog} activeThemeId={collection.theme} />
    </div>
  );
}

export function ProductDetailPage({ catalog = fallbackCatalog, product, collection }: { catalog?: CatalogData; product: Product; collection: Collection }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const activeTheme = getTheme(catalog, product.theme);

  return (
    <div className={activeTheme.pageClass}>
      <Navigation activeTheme={activeTheme} cartCount={added ? 2 : 1} />
      <main className="px-5 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-2xs uppercase tracking-[0.16em] opacity-60">
            <Link href={themeHref[activeTheme.id]}>{activeTheme.label}</Link> / <Link href={`/collections/${collection.slug}`}>{collection.title}</Link> / {product.name}
          </div>
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <ProductArtwork product={product} tall />
            <aside className="space-y-7">
              <span className="inline-flex border border-current/20 px-3 py-2 font-mono text-2xs uppercase tracking-[0.16em]">{collection.title}</span>
              <div>
                <h1 className={`${collection.fontClass} text-7xl leading-none`}>{product.name}</h1>
                <p className="mt-4 font-mono text-2xl">{product.price}</p>
              </div>
              <p className="font-body text-md leading-relaxed opacity-70">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`grid h-11 min-w-11 place-items-center border px-3 font-mono text-xs ${selectedSize === size ? "border-woven-text bg-woven-text text-woven-inverse" : "border-current/25"}`}>{size}</button>
                ))}
              </div>
              <button type="button" onClick={() => setAdded(true)} className={`${buttonClasses("primary")} w-full`}>{product.status === "Notify Me" ? "Notify Me" : "Add To Cart"}</button>
              {added && <p className="font-mono text-xs uppercase tracking-[0.16em] text-woven-accent">Added to cart</p>}
              {[["Material & Fabric", product.material], ["Shipping & Returns", "Ships in 3 to 5 working days. Returns accepted within 14 days if unworn."]].map(([title, copy]) => (
                <details key={title} className="border-t border-current/15 py-4">
                  <summary className="cursor-pointer font-mono text-2xs uppercase tracking-[0.16em]">{title}</summary>
                  <p className="mt-3 font-body text-sm leading-relaxed opacity-70">{copy}</p>
                </details>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <Footer catalog={catalog} activeThemeId={product.theme} />
    </div>
  );
}

export function DropsPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const products = catalog.products.filter((product) => product.status === "Notify Me" || product.status === "New").slice(0, 6);
  return (
    <>
      <Navigation activeTheme={getTheme(catalog, "winter")} cartCount={1} />
      <main className="bg-woven-near-black px-5 pt-32 text-woven-inverse md:px-10">
        <div className="mx-auto max-w-7xl pb-24">
          <h1 className="font-rajdhani text-10xl font-bold leading-none">Limited. Always.</h1>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((product) => {
              const collection = catalog.collections.find((item) => item.slug === product.collection);
              return <ProductCard key={product.id} product={product} collection={collection} />;
            })}
          </div>
        </div>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}

export function SearchPage({ catalog = fallbackCatalog }: { catalog?: CatalogData }) {
  const [query, setQuery] = useState("");
  const results = catalog.products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <Navigation activeTheme={getTheme(catalog, "classic")} cartCount={1} />
      <main className="min-h-screen bg-woven-dark px-5 pt-32 text-woven-inverse md:px-10">
        <div className="mx-auto max-w-7xl">
          <label className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent" htmlFor="search">Search Woven</label>
          <input id="search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a product, collection, or mood" className="mt-5 w-full border-b border-woven-inverse/25 bg-transparent py-5 font-display text-6xl outline-none placeholder:text-woven-inverse/25" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(query ? results : catalog.products.slice(0, 8)).map((product) => <ProductCard key={product.id} product={product} collection={catalog.collections.find((item) => item.slug === product.collection)} />)}
          </div>
        </div>
      </main>
    </>
  );
}

function CheckoutForm({ products }: { products: Product[] }) {
  const items = products.map((product) => ({
    productSlug: product.slug,
    name: product.name,
    pricePkr: priceToNumber(product.price),
    quantity: 1,
    size: "M",
  }));
  const subtotal = items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const cardNumber = String(form.get("cardNumber") ?? "").replace(/\D/g, "");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("customerName"),
        email: form.get("email"),
        phone: form.get("phone"),
        address: form.get("address"),
        city: form.get("city"),
        paymentMethod,
        card:
          paymentMethod === "card"
            ? {
                holder: form.get("cardHolder"),
                last4: cardNumber.slice(-4),
                brand: detectCardBrand(cardNumber),
                expiry: form.get("cardExpiry"),
              }
            : undefined,
        items,
      }),
    });
    const result = (await response.json()) as { orderNumber?: string; paymentStatus?: string; totalPkr?: number; error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(result.error ?? "Checkout failed.");
      return;
    }

    setStatus("success");
    setMessage(`Order ${result.orderNumber} created. Payment status: ${result.paymentStatus}.`);
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="checkout-field">
            <span>Name</span>
            <input name="customerName" required placeholder="Full name" />
          </label>
          <label className="checkout-field">
            <span>Email</span>
            <input name="email" required type="email" placeholder="you@example.com" />
          </label>
          <label className="checkout-field">
            <span>Phone</span>
            <input name="phone" required placeholder="+92..." />
          </label>
          <label className="checkout-field">
            <span>City</span>
            <input name="city" required placeholder="City" />
          </label>
        </div>
        <label className="checkout-field">
          <span>Shipping Address</span>
          <textarea name="address" required rows={4} placeholder="House, street, area" />
        </label>
        <div className="grid gap-3">
          <p className="font-mono text-2xs uppercase tracking-[0.18em] text-woven-accent">Payment Method</p>
          {[
            ["cod", "Cash on Delivery", "Pay when the order arrives."],
            ["bank_transfer", "Bank Transfer", "Create the order and complete transfer manually."],
            ["card", "Card Payment", "Authorize securely using your card details."],
          ].map(([value, title, copy]) => (
            <label key={value} className={`payment-option ${paymentMethod === value ? "is-selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={paymentMethod === value}
                onChange={() => setPaymentMethod(value as PaymentMethod)}
              />
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
            </label>
          ))}
        </div>
        {paymentMethod === "card" && <CardPaymentFields />}
        <button type="submit" disabled={status === "saving"} className={buttonClasses("primary")}>
          {status === "saving" ? "Creating Order" : "Place Order"}
        </button>
        {message && (
          <p className={`border p-4 font-body text-sm ${status === "success" ? "border-emerald-500 text-emerald-700" : "border-red-500 text-red-700"}`}>
            {message}
          </p>
        )}
      </form>
      <aside className="h-fit border border-woven-border bg-woven-surface p-6">
        <p className="font-mono text-2xs uppercase tracking-[0.18em]">Order Summary</p>
        <div className="mt-5 grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[72px_1fr] gap-3">
              <ProductArtwork product={product} />
              <div>
                <p className="font-display text-2xl leading-tight">{product.name}</p>
                <p className="mt-1 font-mono text-2xs uppercase tracking-[0.14em] text-woven-muted">Size M / Qty 1</p>
                <p className="mt-2 font-mono text-xs">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-2 border-t border-woven-border pt-5 font-body text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>PKR {subtotal.toLocaleString("en-US")}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>PKR {shipping.toLocaleString("en-US")}</span></div>
          <div className="flex justify-between font-bold"><span>Total</span><span>PKR {total.toLocaleString("en-US")}</span></div>
        </div>
      </aside>
    </div>
  );
}

function detectCardBrand(cardNumber: string) {
  if (/^4/.test(cardNumber)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) return "mastercard";
  if (/^3[47]/.test(cardNumber)) return "amex";
  return "card";
}

function formatCardNumberInput(event: React.FormEvent<HTMLInputElement>) {
  const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 19);
  event.currentTarget.value = digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiryInput(event: React.FormEvent<HTMLInputElement>) {
  const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
  const month = digits.slice(0, 2);
  const year = digits.slice(2);
  event.currentTarget.value = year ? `${month}/${year}` : month;
}

function CardPaymentFields() {
  return (
    <div className="card-payment-panel">
      <label className="checkout-field">
        <span>Name on card</span>
        <input name="cardHolder" required autoComplete="cc-name" placeholder="Cardholder name" />
      </label>
      <label className="checkout-field md:col-span-2">
        <span>Card number</span>
        <input
          name="cardNumber"
          required
          autoComplete="cc-number"
          inputMode="numeric"
          onInput={formatCardNumberInput}
          minLength={12}
          maxLength={23}
          pattern="[0-9 ]{12,23}"
          placeholder="4242 4242 4242 4242"
        />
      </label>
      <label className="checkout-field">
        <span>Expiry</span>
        <input
          name="cardExpiry"
          required
          autoComplete="cc-exp"
          inputMode="numeric"
          onInput={formatExpiryInput}
          minLength={5}
          maxLength={5}
          pattern="(0[1-9]|1[0-2])/[0-9]{2}"
          placeholder="MM/YY"
        />
      </label>
      <label className="checkout-field">
        <span>CVC</span>
        <input name="cardCvc" required autoComplete="cc-csc" inputMode="numeric" minLength={3} maxLength={4} pattern="[0-9]{3,4}" placeholder="123" />
      </label>
      <p className="md:col-span-2 font-body text-sm leading-relaxed text-woven-muted">
        Card details are used only for this checkout request. Woven saves the brand and last four digits with the payment record.
      </p>
    </div>
  );
}

export function SimpleContentPage({ type, catalog = fallbackCatalog }: { type: "about" | "cart" | "checkout" | "account" | "legal"; catalog?: CatalogData }) {
  const products = useMemo(() => catalog.products.slice(0, 2), [catalog.products]);
  const subtotal = products.reduce((sum, product) => sum + priceToNumber(product.price), 0);
  const title = type === "about" ? "Clothing Worlds For Everyday Life." : type === "cart" ? "Cart Review" : type === "checkout" ? "Checkout" : type === "account" ? "Saved Pieces" : "Returns, Terms, And Privacy";

  return (
    <>
      <Navigation activeTheme={getTheme(catalog, "classic")} cartCount={1} />
      <main className="bg-woven-bg px-5 pb-24 pt-32 text-woven-text md:px-10">
        <section className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-woven-accent">Woven</p>
          <h1 className="mt-4 max-w-4xl font-display text-7xl leading-none md:text-10xl">{title}</h1>
          {type === "cart" || type === "checkout" ? (
            type === "checkout" ? (
              <CheckoutForm products={products} />
            ) : (
              <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="grid gap-4">
                {products.map((product) => <div key={product.id} className="grid gap-4 border border-woven-border p-4 sm:grid-cols-[120px_1fr_auto]"><ProductArtwork product={product} /><div><h2 className="font-display text-4xl">{product.name}</h2><p className="mt-2 font-body text-sm text-woven-muted">Size M / Quantity 1</p></div><p className="font-mono text-sm">{product.price}</p></div>)}
              </div>
              <aside className="h-fit border border-woven-border p-6">
                <p className="font-mono text-2xs uppercase tracking-[0.18em]">Order Summary</p>
                <div className="mt-5 flex justify-between font-body"><span>Subtotal</span><span>PKR {subtotal.toLocaleString("en-US")}</span></div>
                <Link href="/checkout/delivery" className={`${buttonClasses("primary")} mt-6 w-full`}>Continue</Link>
              </aside>
            </div>
            )
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[["01", "Choose A Theme", "Move between Classic, Summer, and Winter as complete clothing worlds."], ["02", "Find Your Pieces", "Browse plain essentials, summer outfits, winter layers, and formal edits."], ["03", "Wear Your Way", "Build a wardrobe around the weather, the day, and your own rhythm."]].map(([number, heading, copy]) => (
                <article key={number} className="border border-woven-border bg-woven-surface p-6"><p className="font-mono text-2xs uppercase tracking-[0.18em] text-woven-accent">{number}</p><h2 className="mt-8 font-display text-5xl">{heading}</h2><p className="mt-3 font-body text-sm leading-relaxed text-woven-muted">{copy}</p></article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}
