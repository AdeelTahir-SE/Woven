export type CollectionSlug =
  | "thread-classics"
  | "minimal-edit"
  | "digital-weave"
  | "street-stitch"
  | "glitch-drop"
  | "society";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  collection: CollectionSlug;
  sizes: string[];
  palette: string;
  status?: "New" | "Sold Out" | "Notify Me";
  description: string;
  material: string;
};

export type Collection = {
  slug: CollectionSlug;
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
  collections: Collection[];
  products: Product[];
};

export type SupabaseCollectionRow = {
  slug: string;
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
  collection_slug: CollectionSlug;
  sizes: string[];
  palette: string;
  status: Product["status"] | null;
  description: string;
  material: string;
  sort_order: number;
};

export const fallbackProducts: Product[] = [
  {
    id: "tc-01",
    slug: "foundation-oxford-shirt",
    name: "Foundation Oxford Shirt",
    price: "PKR 4,800",
    collection: "thread-classics",
    sizes: ["XS", "S", "M", "L", "XL"],
    palette: "from-stone-100 via-neutral-200 to-stone-300",
    status: "New",
    description:
      "A brushed cotton oxford with a relaxed campus fit, soft collar, and stitched Woven mark at the cuff.",
    material: "220gsm cotton oxford, corozo buttons, reinforced seams.",
  },
  {
    id: "tc-02",
    slug: "library-knit-polo",
    name: "Library Knit Polo",
    price: "PKR 5,200",
    collection: "thread-classics",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-zinc-200 via-stone-100 to-zinc-300",
    description:
      "Fine rib texture, structured placket, and a weight that works from morning lectures to evening critiques.",
    material: "Cotton viscose knit with ribbed cuffs and collar.",
  },
  {
    id: "me-01",
    slug: "folded-seam-jacket",
    name: "Folded Seam Jacket",
    price: "PKR 7,900",
    collection: "minimal-edit",
    sizes: ["XS", "S", "M", "L"],
    palette: "from-neutral-300 via-stone-200 to-zinc-100",
    status: "New",
    description:
      "A quiet overshirt with hidden pockets, flat-felled seams, and a sharp box silhouette.",
    material: "Midweight cotton twill with recycled poly lining.",
  },
  {
    id: "me-02",
    slug: "paperweight-trouser",
    name: "Paperweight Trouser",
    price: "PKR 5,600",
    collection: "minimal-edit",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-stone-200 via-neutral-100 to-stone-300",
    description:
      "Pleated, cropped, and easy to move in, made for studio days and pinned-up deadlines.",
    material: "Cotton poplin blend with a matte hand feel.",
  },
  {
    id: "dw-01",
    slug: "compile-hoodie",
    name: "Compile Hoodie",
    price: "PKR 6,400",
    collection: "digital-weave",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-neutral-900 via-cyan-950 to-zinc-800",
    status: "New",
    description:
      "Heavy fleece hoodie with pixel-grid sleeve panels and a hidden headphone loop inside the hood.",
    material: "320gsm brushed fleece, rib inserts, reflective woven label.",
  },
  {
    id: "dw-02",
    slug: "runtime-cargo",
    name: "Runtime Cargo",
    price: "PKR 6,900",
    collection: "digital-weave",
    sizes: ["S", "M", "L"],
    palette: "from-zinc-900 via-neutral-700 to-cyan-950",
    description:
      "Tapered cargo pant with utility pockets and tonal grid embroidery at the knee.",
    material: "Ripstop cotton nylon with matte hardware.",
  },
  {
    id: "ss-01",
    slug: "underpass-tee",
    name: "Underpass Tee",
    price: "PKR 3,200",
    collection: "street-stitch",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-neutral-950 via-stone-700 to-neutral-200",
    status: "New",
    description:
      "Oversized tee with cracked ink typography, raw edge label, and a heavy drape.",
    material: "240gsm cotton jersey with discharge print.",
  },
  {
    id: "ss-02",
    slug: "zine-canvas-vest",
    name: "Zine Canvas Vest",
    price: "PKR 6,100",
    collection: "street-stitch",
    sizes: ["S", "M", "L"],
    palette: "from-stone-800 via-neutral-500 to-stone-200",
    description:
      "Canvas vest with asymmetric pockets and removable hand-tag panel for pins and patches.",
    material: "Washed canvas, cotton tape, antique nickel snaps.",
  },
  {
    id: "gd-01",
    slug: "signal-loss-shell",
    name: "Signal Loss Shell",
    price: "PKR 8,400",
    collection: "glitch-drop",
    sizes: ["S", "M", "L"],
    palette: "from-fuchsia-950 via-neutral-950 to-cyan-950",
    status: "Notify Me",
    description:
      "Limited shell jacket with sliced reflective panels and a packable hood. Next drop opens soon.",
    material: "Water-resistant nylon, mesh lining, reflective heat transfer.",
  },
  {
    id: "gd-02",
    slug: "ghost-frame-tee",
    name: "Ghost Frame Tee",
    price: "PKR 3,600",
    collection: "glitch-drop",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-neutral-950 via-fuchsia-900 to-cyan-900",
    status: "Sold Out",
    description:
      "A graphic tee with offset cyan and magenta frame graphics, released in a numbered run.",
    material: "Cotton jersey with soft-hand screen print.",
  },
  {
    id: "sc-01",
    slug: "debate-club-blazer",
    name: "Debate Club Blazer",
    price: "PKR 12,800",
    collection: "society",
    sizes: ["XS", "S", "M", "L"],
    palette: "from-amber-950 via-stone-700 to-woven-tan",
    status: "New",
    description:
      "Unstructured blazer with crest lining, soft shoulders, and a lapel made for society nights.",
    material: "Cotton wool blend with satin jacquard lining.",
  },
  {
    id: "sc-02",
    slug: "chairperson-waistcoat",
    name: "Chairperson Waistcoat",
    price: "PKR 7,300",
    collection: "society",
    sizes: ["S", "M", "L", "XL"],
    palette: "from-stone-700 via-woven-tan to-amber-100",
    description:
      "A tailored waistcoat with double-rule stitching and a neat inner pocket for debate notes.",
    material: "Textured cotton blend, horn buttons, contrast piping.",
  },
];

export const fallbackCollectionShells: Omit<Collection, "products">[] = [
  {
    slug: "thread-classics",
    number: "01",
    title: "Thread Classics",
    displayTitle: "Thread Classics",
    tagline: "The Foundation Pieces",
    mood: "Refined heritage basics for students who want quiet quality.",
    logo: 1,
    logoSheet: 1,
    bgClass: "bg-woven-bg",
    textClass: "text-woven-text",
    fontClass: "font-display",
  },
  {
    slug: "minimal-edit",
    number: "02",
    title: "Minimal Edit",
    displayTitle: "minimal edit",
    tagline: "Less. Meant.",
    mood: "Japanese-inspired cuts, muted tones, and considered whitespace.",
    logo: 5,
    logoSheet: 1,
    bgClass: "bg-woven-surface",
    textClass: "text-woven-text",
    fontClass: "font-syne",
  },
  {
    slug: "digital-weave",
    number: "03",
    title: "Digital Weave",
    displayTitle: "DIGITAL WEAVE",
    tagline: "Generated. Designed. Worn.",
    mood: "Pixelated, technical, and built for late-night labs.",
    logo: 3,
    logoSheet: 1,
    bgClass: "bg-woven-dark",
    textClass: "text-woven-inverse",
    fontClass: "font-grotesk",
  },
  {
    slug: "street-stitch",
    number: "04",
    title: "Street Stitch",
    displayTitle: "STREET STITCH",
    tagline: "Built Different.",
    mood: "Raw, oversized, noisy, and tuned to campus subculture.",
    logo: 9,
    logoSheet: 1,
    bgClass: "bg-woven-bg",
    textClass: "text-woven-text",
    fontClass: "font-bebas",
  },
  {
    slug: "glitch-drop",
    number: "05",
    title: "Glitch Drop",
    displayTitle: "GLITCH DROP",
    tagline: "Think. Create. Wear.",
    mood: "Limited digital distortion with a real countdown pulse.",
    logo: 6,
    logoSheet: 1,
    bgClass: "bg-woven-near-black",
    textClass: "text-woven-inverse",
    fontClass: "font-rajdhani",
  },
  {
    slug: "society",
    number: "06",
    title: "Society Collection",
    displayTitle: "Society Collection",
    tagline: "Est. 2025. For Those Who Lead.",
    mood: "Academic heritage for debate nights, MUN floors, and formal campus rituals.",
    logo: 7,
    logoSheet: 1,
    bgClass: "bg-woven-tan",
    textClass: "text-woven-text",
    fontClass: "font-playfair",
  },
];

export const fallbackCollections = buildCollections(fallbackCollectionShells, fallbackProducts);
export const fallbackCatalog: CatalogData = {
  collections: fallbackCollections,
  products: fallbackProducts,
};

export function formatPrice(pricePkr: number) {
  return `PKR ${pricePkr.toLocaleString("en-US")}`;
}

export function mapSupabaseCollection(row: SupabaseCollectionRow): Omit<Collection, "products"> {
  return {
    slug: row.slug as CollectionSlug,
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
    collection: row.collection_slug,
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
    products: catalogProducts.filter((product) => product.collection === collection.slug),
  }));
}

export function getCollectionFromCatalog(catalog: CatalogData, slug: string) {
  return catalog.collections.find((collection) => collection.slug === slug);
}

export function getProductFromCatalog(catalog: CatalogData, slug: string) {
  return catalog.products.find((product) => product.slug === slug);
}
