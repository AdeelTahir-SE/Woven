export type ThemeId = "classic" | "summer" | "winter";

export type CollectionSlug =
  | "plain-essentials"
  | "formal-edit"
  | "refined-basics"
  | "sky-t-shirts"
  | "light-pants"
  | "summer-sets"
  | "ice-hoodies"
  | "cold-air-jackets"
  | "winter-essentials";

export type Theme = {
  id: ThemeId;
  label: string;
  tagline: string;
  heroTitle: string;
  heroMedia: "classic" | "summer" | "winter";
  navClass: string;
  navTextClass: string;
  stripClass: string;
  stripTextClass: string;
  pageClass: string;
  accentName: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  theme: ThemeId;
  collection: CollectionSlug;
  imagePath: string;
  imageAlt: string;
  hoverImagePath?: string;
  sizes: string[];
  palette: string;
  status?: "New" | "Sold Out" | "Notify Me";
  description: string;
  material: string;
};

export type Collection = {
  slug: CollectionSlug;
  theme: ThemeId;
  number: string;
  title: string;
  displayTitle: string;
  tagline: string;
  mood: string;
  logo: number;
  logoSheet: 1 | 2;
  bgClass: string;
  textClass: string;
  fontClass: string;
  products: Product[];
};

export type CatalogData = {
  themes: Theme[];
  collections: Collection[];
  products: Product[];
};

export type SupabaseThemeRow = {
  id: ThemeId;
  label: string;
  tagline: string;
  hero_title: string;
  hero_media: Theme["heroMedia"];
  nav_class: string;
  nav_text_class: string;
  strip_class: string;
  strip_text_class: string;
  page_class: string;
  accent_name: string;
  sort_order: number;
};

export type SupabaseCollectionRow = {
  slug: string;
  theme_id: ThemeId;
  number: string;
  title: string;
  display_title: string;
  tagline: string;
  mood: string;
  logo: number;
  logo_sheet: 1 | 2;
  bg_class: string;
  text_class: string;
  font_class: string;
  sort_order: number;
};

export type SupabaseProductRow = {
  sku: string;
  slug: string;
  name: string;
  price_pkr: number;
  theme_id: ThemeId;
  collection_slug: CollectionSlug;
  image_path: string;
  image_alt: string;
  hover_image_path: string | null;
  sizes: string[];
  palette: string;
  status: Product["status"] | null;
  description: string;
  material: string;
  sort_order: number;
};

export const fallbackThemes: Theme[] = [
  {
    id: "classic",
    label: "Classic",
    tagline: "Plain, formal, and refined pieces for everyday life.",
    heroTitle: "Woven",
    heroMedia: "classic",
    navClass: "border-woven-border bg-woven-bg/92",
    navTextClass: "text-woven-text",
    stripClass: "border-woven-border bg-woven-bg/95",
    stripTextClass: "text-woven-text",
    pageClass: "theme-classic bg-woven-bg text-woven-text",
    accentName: "heritage gold",
    sortOrder: 1,
  },
  {
    id: "summer",
    label: "Summer",
    tagline: "Made for open skies, easy movement, and warm days together.",
    heroTitle: "Woven",
    heroMedia: "summer",
    navClass: "border-black bg-black",
    navTextClass: "text-black md:text-white",
    stripClass: "border-black bg-black",
    stripTextClass: "text-black",
    pageClass: "theme-summer bg-white text-black",
    accentName: "sky blue",
    sortOrder: 2,
  },
  {
    id: "winter",
    label: "Winter",
    tagline: "Layers for cold air, quiet light, and crisp winter days.",
    heroTitle: "Woven",
    heroMedia: "winter",
    navClass: "border-winter-ice bg-winter-ice/95",
    navTextClass: "text-winter-ink",
    stripClass: "border-winter-ice bg-winter-ice/95",
    stripTextClass: "text-winter-ink",
    pageClass: "theme-winter bg-winter-mist text-winter-ink",
    accentName: "ice blue",
    sortOrder: 3,
  },
];

export const fallbackProducts: Product[] = [
  {
    id: "pe-01",
    slug: "clean-crew-tee",
    name: "Clean Crew Tee",
    price: "PKR 3,200",
    theme: "classic",
    collection: "plain-essentials",
    imagePath: "classic/plain-essentials/clean-crew-tee.jpg",
    imageAlt: "Clean Crew Tee product image",
    sizes: ["XS", "S", "M", "L", "XL"],
    palette: "from-stone-100 via-neutral-200 to-stone-300",
    status: "New",
    description: "A soft heavyweight crew with a straight fit and a quiet stitched Woven mark.",
    material: "240gsm cotton jersey with reinforced shoulder seams.",
  },
  {
    id: "pe-02",
    slug: "everyday-oxford-shirt",
    name: "Everyday Oxford Shirt",
    price: "PKR 4,800",
    theme: "classic",
    collection: "plain-essentials",
    imagePath: "classic/plain-essentials/everyday-oxford-shirt.jpg",
    imageAlt: "Everyday Oxford Shirt product image",
    sizes: ["XS", "S", "M", "L", "XL"],
    palette: "from-zinc-100 via-stone-100 to-neutral-300",
    description: "A brushed cotton oxford with a relaxed fit, soft collar, and clean cuff finish.",
    material: "220gsm cotton oxford, corozo buttons, reinforced seams.",
  },
  {
    id: "fe-01",
    slug: "soft-structure-blazer",
    name: "Soft Structure Blazer",
    price: "PKR 12,800",
    theme: "classic",
    collection: "formal-edit",
    imagePath: "classic/formal-edit/soft-structure-blazer.jpg",
    imageAlt: "Soft Structure Blazer product image",
    sizes: ["XS", "S", "M", "L"],
    palette: "from-neutral-900 via-stone-700 to-woven-tan",
    status: "New",
    description: "An unstructured blazer with natural shoulders, clean lining, and a polished daily shape.",
    material: "Cotton wool blend with satin jacquard lining.",
  },
  {
    id: "fe-02",
    slug: "tailored-waistcoat",
    name: "Tailored Waistcoat",
    price: "PKR 7,300",
    theme: "classic",
    collection: "formal-edit",
    imagePath: "classic/formal-edit/tailored-waistcoat.jpg",
    imageAlt: "Tailored Waistcoat product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-stone-700 via-woven-tan to-amber-100",
    description: "A neat waistcoat with double-rule stitching, horn buttons, and an easy formal finish.",
    material: "Textured cotton blend, horn buttons, contrast piping.",
  },
  {
    id: "rb-01",
    slug: "folded-seam-overshirt",
    name: "Folded Seam Overshirt",
    price: "PKR 7,900",
    theme: "classic",
    collection: "refined-basics",
    imagePath: "classic/refined-basics/folded-seam-overshirt.jpg",
    imageAlt: "Folded Seam Overshirt product image",
    sizes: ["XS", "S", "M", "L"],
    palette: "from-neutral-300 via-stone-200 to-zinc-100",
    description: "A quiet overshirt with hidden pockets, flat-felled seams, and a sharp box silhouette.",
    material: "Midweight cotton twill with recycled poly lining.",
  },
  {
    id: "rb-02",
    slug: "paperweight-trouser",
    name: "Paperweight Trouser",
    price: "PKR 5,600",
    theme: "classic",
    collection: "refined-basics",
    imagePath: "classic/refined-basics/paperweight-trouser.jpg",
    imageAlt: "Paperweight Trouser product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-stone-200 via-neutral-100 to-stone-300",
    description: "Pleated, cropped, and easy to move in, made for long days and clean silhouettes.",
    material: "Cotton poplin blend with a matte hand feel.",
  },
  {
    id: "st-01",
    slug: "skyline-pocket-tee",
    name: "Skyline Pocket Tee",
    price: "PKR 3,000",
    theme: "summer",
    collection: "sky-t-shirts",
    imagePath: "summer/sky-t-shirts/skyline-pocket-tee.jpg",
    imageAlt: "Skyline Pocket Tee product image",
    sizes: ["XS", "S", "M", "L", "XL"],
    palette: "from-sky-200 via-cyan-100 to-yellow-100",
    status: "New",
    description: "A breathable pocket tee with a relaxed shoulder and sun-washed color.",
    material: "Cotton jersey with garment-washed softness.",
  },
  {
    id: "st-02",
    slug: "sun-drift-tee",
    name: "Sun Drift Tee",
    price: "PKR 3,100",
    theme: "summer",
    collection: "sky-t-shirts",
    imagePath: "summer/sky-t-shirts/sun-drift-tee.jpg",
    imageAlt: "Sun Drift Tee product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-blue-100 via-sky-300 to-white",
    description: "A clean summer tee with airy weight, smooth neckline, and easy daily drape.",
    material: "Lightweight combed cotton jersey.",
  },
  {
    id: "lp-01",
    slug: "breeze-cotton-pant",
    name: "Breeze Cotton Pant",
    price: "PKR 5,400",
    theme: "summer",
    collection: "light-pants",
    imagePath: "summer/light-pants/breeze-cotton-pant.jpg",
    imageAlt: "Breeze Cotton Pant product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-stone-100 via-sky-100 to-cyan-200",
    status: "New",
    description: "Straight-leg cotton pants with a soft hand feel and room for warm-weather movement.",
    material: "Cotton poplin with elastic side tabs.",
  },
  {
    id: "lp-02",
    slug: "open-air-chino",
    name: "Open Air Chino",
    price: "PKR 5,800",
    theme: "summer",
    collection: "light-pants",
    imagePath: "summer/light-pants/open-air-chino.jpg",
    imageAlt: "Open Air Chino product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-cyan-100 via-white to-yellow-100",
    description: "A tapered chino with lightweight structure, clean pockets, and a bright summer finish.",
    material: "Cotton twill with a breathable weave.",
  },
  {
    id: "ssu-01",
    slug: "sunset-easy-set",
    name: "Sunset Easy Set",
    price: "PKR 8,600",
    theme: "summer",
    collection: "summer-sets",
    imagePath: "summer/summer-sets/sunset-easy-set.jpg",
    imageAlt: "Sunset Easy Set product image",
    sizes: ["S", "M", "L"],
    palette: "from-sky-300 via-orange-100 to-white",
    status: "New",
    description: "A matching tee and pant set for slow weekends, travel days, and outdoor plans.",
    material: "Cotton linen blend with soft rib trim.",
  },
  {
    id: "ssu-02",
    slug: "poolside-knit-polo",
    name: "Poolside Knit Polo",
    price: "PKR 5,200",
    theme: "summer",
    collection: "summer-sets",
    imagePath: "summer/summer-sets/poolside-knit-polo.jpg",
    imageAlt: "Poolside Knit Polo product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-white via-sky-100 to-blue-200",
    description: "Fine rib texture, structured placket, and a light hand for sunny-day polish.",
    material: "Cotton viscose knit with ribbed cuffs and collar.",
  },
  {
    id: "ih-01",
    slug: "frostline-hoodie",
    name: "Frostline Hoodie",
    price: "PKR 6,400",
    theme: "winter",
    collection: "ice-hoodies",
    imagePath: "winter/ice-hoodies/frostline-hoodie.jpg",
    imageAlt: "Frostline Hoodie product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-slate-200 via-blue-100 to-white",
    status: "New",
    description: "Heavy fleece hoodie with a soft brushed interior and a clean ice-toned finish.",
    material: "340gsm brushed fleece, rib inserts, woven label.",
  },
  {
    id: "ih-02",
    slug: "snowfield-zip-hoodie",
    name: "Snowfield Zip Hoodie",
    price: "PKR 6,900",
    theme: "winter",
    collection: "ice-hoodies",
    imagePath: "winter/ice-hoodies/snowfield-zip-hoodie.jpg",
    imageAlt: "Snowfield Zip Hoodie product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-white via-slate-100 to-blue-200",
    description: "A full-zip hoodie with layered pockets, warm ribbing, and soft winter weight.",
    material: "Cotton fleece with brushed interior and metal zip.",
  },
  {
    id: "caj-01",
    slug: "cold-air-puffer",
    name: "Cold Air Puffer",
    price: "PKR 11,800",
    theme: "winter",
    collection: "cold-air-jackets",
    imagePath: "winter/cold-air-jackets/cold-air-puffer.jpg",
    imageAlt: "Cold Air Puffer product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-slate-800 via-blue-200 to-white",
    status: "New",
    description: "A warm puffer with a high collar, cloud-soft fill, and crisp winter silhouette.",
    material: "Water-resistant nylon shell with recycled poly fill.",
  },
  {
    id: "caj-02",
    slug: "glacier-shell-jacket",
    name: "Glacier Shell Jacket",
    price: "PKR 8,400",
    theme: "winter",
    collection: "cold-air-jackets",
    imagePath: "winter/cold-air-jackets/glacier-shell-jacket.jpg",
    imageAlt: "Glacier Shell Jacket product image",
    sizes: ["S", "M", "L"],
    palette: "from-cyan-950 via-slate-700 to-blue-100",
    description: "A protective shell jacket with a packable hood and reflective winter detailing.",
    material: "Water-resistant nylon, mesh lining, reflective heat transfer.",
  },
  {
    id: "we-01",
    slug: "thermal-layer-tee",
    name: "Thermal Layer Tee",
    price: "PKR 3,600",
    theme: "winter",
    collection: "winter-essentials",
    imagePath: "winter/winter-essentials/thermal-layer-tee.jpg",
    imageAlt: "Thermal Layer Tee product image",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-slate-100 via-white to-cyan-100",
    description: "A warm first layer with a smooth face, brushed back, and easy stretch.",
    material: "Cotton thermal blend with flatlock seams.",
  },
  {
    id: "we-02",
    slug: "quiet-snow-scarf",
    name: "Quiet Snow Scarf",
    price: "PKR 2,900",
    theme: "winter",
    collection: "winter-essentials",
    imagePath: "winter/winter-essentials/quiet-snow-scarf.jpg",
    imageAlt: "Quiet Snow Scarf product image",
    sizes: ["One Size"],
    palette: "from-white via-blue-100 to-slate-200",
    status: "New",
    description: "A soft winter scarf with subtle texture and a clean Woven tab.",
    material: "Acrylic wool blend with soft fringe edges.",
  },
];

export const fallbackCollectionShells: Omit<Collection, "products">[] = [
  {
    slug: "plain-essentials",
    theme: "classic",
    number: "01",
    title: "Plain Essentials",
    displayTitle: "Plain Essentials",
    tagline: "Clean Daily Pieces",
    mood: "Simple, reliable clothes with quiet detail and a refined everyday shape.",
    logo: 1,
    logoSheet: 1,
    bgClass: "bg-woven-bg",
    textClass: "text-woven-text",
    fontClass: "font-display",
  },
  {
    slug: "formal-edit",
    theme: "classic",
    number: "02",
    title: "Formal Edit",
    displayTitle: "Formal Edit",
    tagline: "Soft Structure",
    mood: "Polished layers for dinners, meetings, events, and the days that ask for more.",
    logo: 7,
    logoSheet: 1,
    bgClass: "bg-woven-tan",
    textClass: "text-woven-text",
    fontClass: "font-playfair",
  },
  {
    slug: "refined-basics",
    theme: "classic",
    number: "03",
    title: "Refined Basics",
    displayTitle: "refined basics",
    tagline: "Less. Better.",
    mood: "Muted tones, considered cuts, and easy silhouettes for repeat wear.",
    logo: 5,
    logoSheet: 1,
    bgClass: "bg-woven-surface",
    textClass: "text-woven-text",
    fontClass: "font-syne",
  },
  {
    slug: "sky-t-shirts",
    theme: "summer",
    number: "01",
    title: "Sky T-Shirts",
    displayTitle: "Sky T-Shirts",
    tagline: "Light Above Everything",
    mood: "Breathable tees in clear colors, cut for open days and easy movement.",
    logo: 2,
    logoSheet: 1,
    bgClass: "bg-summer-sky",
    textClass: "text-black",
    fontClass: "font-grotesk",
  },
  {
    slug: "light-pants",
    theme: "summer",
    number: "02",
    title: "Light Pants",
    displayTitle: "Light Pants",
    tagline: "Move With The Heat",
    mood: "Airy pants with enough structure for city plans and enough ease for long afternoons.",
    logo: 4,
    logoSheet: 1,
    bgClass: "bg-white",
    textClass: "text-black",
    fontClass: "font-syne",
  },
  {
    slug: "summer-sets",
    theme: "summer",
    number: "03",
    title: "Summer Sets",
    displayTitle: "Summer Sets",
    tagline: "Ready Together",
    mood: "Warm-weather pairings that feel relaxed, bright, and simple to wear.",
    logo: 8,
    logoSheet: 1,
    bgClass: "bg-summer-warm",
    textClass: "text-black",
    fontClass: "font-display",
  },
  {
    slug: "ice-hoodies",
    theme: "winter",
    number: "01",
    title: "Ice Hoodies",
    displayTitle: "Ice Hoodies",
    tagline: "Soft Cold-Weather Weight",
    mood: "Brushed fleece, calm colors, and easy warmth for cold mornings.",
    logo: 3,
    logoSheet: 1,
    bgClass: "bg-winter-ice",
    textClass: "text-winter-ink",
    fontClass: "font-grotesk",
  },
  {
    slug: "cold-air-jackets",
    theme: "winter",
    number: "02",
    title: "Cold-Air Jackets",
    displayTitle: "Cold-Air Jackets",
    tagline: "Outside Layer",
    mood: "Protective shells and puffers shaped for crisp air and shifting weather.",
    logo: 6,
    logoSheet: 1,
    bgClass: "bg-winter-steel",
    textClass: "text-winter-ink",
    fontClass: "font-rajdhani",
  },
  {
    slug: "winter-essentials",
    theme: "winter",
    number: "03",
    title: "Winter Essentials",
    displayTitle: "Winter Essentials",
    tagline: "Quiet Warmth",
    mood: "Thermal layers and small cold-weather pieces made for daily comfort.",
    logo: 9,
    logoSheet: 1,
    bgClass: "bg-winter-mist",
    textClass: "text-winter-ink",
    fontClass: "font-playfair",
  },
];

export const fallbackCollections = buildCollections(fallbackCollectionShells, fallbackProducts);
export const fallbackCatalog: CatalogData = {
  themes: fallbackThemes,
  collections: fallbackCollections,
  products: fallbackProducts,
};

export function formatPrice(pricePkr: number) {
  return `PKR ${pricePkr.toLocaleString("en-US")}`;
}

export function mapSupabaseTheme(row: SupabaseThemeRow): Theme {
  return {
    id: row.id,
    label: row.label,
    tagline: row.tagline,
    heroTitle: row.hero_title,
    heroMedia: row.hero_media,
    navClass: row.nav_class,
    navTextClass: row.nav_text_class,
    stripClass: row.strip_class,
    stripTextClass: row.strip_text_class,
    pageClass: row.page_class,
    accentName: row.accent_name,
    sortOrder: row.sort_order,
  };
}

export function mapSupabaseCollection(row: SupabaseCollectionRow): Omit<Collection, "products"> {
  return {
    slug: row.slug as CollectionSlug,
    theme: row.theme_id,
    number: row.number,
    title: row.title,
    displayTitle: row.display_title,
    tagline: row.tagline,
    mood: row.mood,
    logo: row.logo,
    logoSheet: row.logo_sheet,
    bgClass: row.bg_class,
    textClass: row.text_class,
    fontClass: row.font_class,
  };
}

export function mapSupabaseProduct(row: SupabaseProductRow): Product {
  return {
    id: row.sku,
    slug: row.slug,
    name: row.name,
    price: formatPrice(row.price_pkr),
    theme: row.theme_id,
    collection: row.collection_slug,
    imagePath: row.image_path,
    imageAlt: row.image_alt,
    hoverImagePath: row.hover_image_path ?? undefined,
    sizes: row.sizes,
    palette: row.palette,
    status: row.status ?? undefined,
    description: row.description,
    material: row.material,
  };
}

export function buildCollections(collectionShells: Omit<Collection, "products">[], catalogProducts: Product[]) {
  return collectionShells.map((collection) => ({
    ...collection,
    products: catalogProducts.filter((product) => product.collection === collection.slug && product.theme === collection.theme),
  }));
}

export function getThemeFromCatalog(catalog: CatalogData, id: string) {
  return catalog.themes.find((theme) => theme.id === id);
}

export function getCollectionFromCatalog(catalog: CatalogData, slug: string) {
  return catalog.collections.find((collection) => collection.slug === slug);
}

export function getProductFromCatalog(catalog: CatalogData, slug: string) {
  return catalog.products.find((product) => product.slug === slug);
}
