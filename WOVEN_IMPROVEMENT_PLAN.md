# Woven — Master Improvement & Refinement Plan
**Site:** https://woven-psi.vercel.app/  
**Last Updated:** May 2026  
**Status:** Pre-Production → Production-Ready Roadmap

---

## Table of Contents
1. [Performance Targets](#1-performance-targets)
2. [SEO Strategy & Keyword Plan](#2-seo-strategy--keyword-plan)
3. [Technical SEO Implementation](#3-technical-seo-implementation)
4. [Payment Gateway Migration (Safepay)](#4-payment-gateway-migration-safepay)
5. [Backend & Database (Supabase)](#5-backend--database-supabase)
6. [LLM & AI Integration](#6-llm--ai-integration)
7. [Code Cleanup & Optimization](#7-code-cleanup--optimization)
8. [Authentication](#8-authentication)
9. [Content & Copywriting](#9-content--copywriting)
10. [Developer Execution Checklist](#10-developer-execution-checklist)

---

## 1. Performance Targets

### Core Web Vitals — Required Scores (Lighthouse / PageSpeed Insights)

| Metric | Target | Current Estimate | Notes |
|--------|--------|-----------------|-------|
| **Performance Score** | ≥ 95 | ~60–70 (est.) | Blocked by unoptimized images, large font payload |
| **Accessibility Score** | ≥ 95 | ~80 (est.) | Missing alt tags, ARIA labels |
| **Best Practices Score** | ≥ 95 | ~85 (est.) | HTTP/2, no mixed content |
| **SEO Score** | ≥ 100 | ~70 (est.) | Missing meta, hreflang, sitemap |
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | ~4–5s (est.) | Hero image not preloaded |
| **FID / INP (Interaction to Next Paint)** | ≤ 200ms | Unknown | Stripe JS may block |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | ~0.2 (est.) | Images without fixed dimensions |
| **FCP (First Contentful Paint)** | ≤ 1.8s | ~3s (est.) | Font preload needed |
| **TTFB (Time to First Byte)** | ≤ 800ms | ~600ms (est.) | Vercel Edge — acceptable |

### Action Items to Hit Targets

#### 1.1 Image Optimization (CRITICAL — biggest LCP/CLS impact)
- **Replace all `<img>` tags with Next.js `<Image />`** component. There are currently **12 linter warnings** for raw `<img>` usage.
- Always set explicit `width` and `height` props to prevent CLS.
- Use `priority` prop on the above-the-fold hero image to trigger LCP preloading.
- Use `sizes` attribute for responsive images: `sizes="(max-width: 768px) 100vw, 50vw"`.
- Serve images from Supabase Storage with automatic WebP conversion where possible.
- Add a `<link rel="preload" as="image" href="/hero.webp">` in `<head>` for the hero.

```tsx
// ❌ Wrong
<img src="/products/tee.jpg" alt="Tee" />

// ✅ Correct
import Image from 'next/image';
<Image
  src="/products/clean-crew-tee.jpg"
  alt="Clean Crew Tee in heavyweight cotton jersey — Woven"
  width={800}
  height={1000}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority // only for above-the-fold
/>
```

#### 1.2 Font Optimization (FCP Impact)
- Audit `layout.tsx` — remove unused font families.
- Migrate to `next/font/google` for automatic subsetting and zero layout shift:

```tsx
// ✅ In layout.tsx
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});
```

#### 1.3 Bundle Size Reduction
- Remove `stripe` and `@stripe/react-stripe-js` after Safepay migration (saves ~80–120 KB gzipped).
- Run `npx @next/bundle-analyzer` to identify other heavy modules.
- Ensure dynamic imports for any modal/drawer components not needed on initial load:

```tsx
const CheckoutModal = dynamic(() => import('./CheckoutModal'), { ssr: false });
```

#### 1.4 CLS Fixes
- Every product card image must have fixed aspect ratios via CSS or explicit `width`/`height`.
- Use `aspect-ratio: 3/4` on image containers to reserve space before load.
- Avoid inserting banners or modals that push content down after load.

---

## 2. SEO Strategy & Keyword Plan

### Brand Context
Woven is a Pakistani direct-to-consumer clothing brand selling theme-led essentials online at `woven-psi.vercel.app` (to be migrated to `woven.pk`). The current storefront is organized around Classic, Summer, and Winter worlds, with plain essentials, formal edits, refined basics, tees, pants, sets, hoodies, jackets, and winter accessories.

### 2.1 Page-Level Title & Meta Description Targets

| Page | Recommended `<title>` Tag | Recommended Meta Description |
|------|--------------------------|------------------------------|
| **Homepage** | `Woven — Ideas Stitched Into Reality` | `Explore Woven's theme-led clothing collections across Classic, Summer, and Winter: everyday tees, shirts, pants, formal layers, hoodies, jackets, and accessories.` |
| **Shop / All Products** | `Shop Woven Clothing — Everyday Essentials & Seasonal Layers` | `Browse Woven clothing by fit, fabric, theme, and season. Shop tees, shirts, pants, blazers, hoodies, jackets, sets, scarves, and repeat-wear essentials.` |
| **Collections** | `Collections — Woven Classic, Summer & Winter Edits` | `Explore Woven collections across Plain Essentials, Formal Edit, Refined Basics, summer pieces, cold-air jackets, hoodies, and winter essentials.` |
| **Product Detail Page** | `[Product Name] — Woven` (e.g., `Clean Crew Tee — Woven`) | Dynamic: pulled from product description. Min 120 chars, max 160. |
| **About** | `About Woven — Theme-Led Clothing Essentials` | `Woven creates simple, considered clothing for daily wear, warm days, polished moments, and cold-weather layering.` |
| **FAQ** | `Frequently Asked Questions — Woven` | `Find answers to common questions about Woven's delivery policy, returns, fabric care, sizing, and payment options.` |
| **Contact** | `Contact Woven — Get in Touch` | `Reach out to the Woven team for order support, wholesale inquiries, or press collaboration. We respond within 24 hours.` |
| **Size Guide** | `Size Guide — Woven Clothing Fits & Measurements` | `Use Woven's size guide for tees, shirts, pants, blazers, hoodies, jackets, sets, and one-size accessories.` |
| **Returns & Legal** | `Shipping & Returns — Woven` | `Review Woven delivery, exchange, return, privacy, and terms details before placing your order.` |

### 2.2 Primary Keyword Targets

These keywords should appear naturally in page headings (H1, H2), product descriptions, alt text, and metadata.

#### Tier 1 — High Intent, Commercial
| Keyword | Monthly Searches (PK est.) | Target Page |
|---------|--------------------------|-------------|
| `minimal clothing Pakistan` | Research in GSC/Keyword Planner | Homepage, Shop |
| `men essentials clothing Pakistan` | Research in GSC/Keyword Planner | Shop, Product pages |
| `cotton t shirts Pakistan` | Research in GSC/Keyword Planner | Shop, Product pages |
| `hoodies Pakistan online` | Research in GSC/Keyword Planner | Winter collections |
| `jackets Pakistan online` | Research in GSC/Keyword Planner | Winter collections |
| `formal waistcoat Pakistan` | Research in GSC/Keyword Planner | Formal Edit |
| `blazer Pakistan online` | Research in GSC/Keyword Planner | Formal Edit |
| `Woven clothing Pakistan` | Branded | Homepage, About |

#### Tier 2 — Informational / Long-Tail
| Keyword | Intent | Target Page |
|---------|--------|-------------|
| `how to wash cotton t shirts` | Informational | FAQ, Product pages |
| `how should a hoodie fit` | Informational | Size Guide, Product pages |
| `men clothing size guide Pakistan` | Informational | Size Guide |
| `best everyday clothing Pakistan` | Commercial | Homepage, Shop |
| `minimal wardrobe essentials Pakistan` | Commercial | Collections |
| `winter layers Pakistan online` | Transactional | Winter collections |

#### Tier 3 — Local & Regional
| Keyword | Target |
|---------|--------|
| `clothing brand Lahore online` | Homepage, Shop |
| `Karachi clothing delivery` | Shipping, Shop |
| `online clothing store Pakistan` | Homepage, Shop |
| `woven clothing Pakistan` | Branded — Homepage |
| `woven.pk` | Branded — all pages |

### 2.3 H1 / H2 Heading Guidelines

- **Homepage H1:** `Woven`
- **Shop H1:** `Shop Woven`
- **Collection H1 (dynamic):** `[Collection Name] — Woven Collection`
- **Product H1 (dynamic):** `[Product Name]` — always include the exact catalog product name.
- **About H1:** `We Are Woven.`

### 2.4 Alt Text Guidelines

Every product image alt tag must follow this pattern:  
`[product name] [product type or fit] in [material/color/use case] — [brand]`

**Examples:**
- `Clean Crew Tee in heavyweight cotton jersey — Woven`
- `Soft Structure Blazer with natural shoulders — Woven`
- `Frostline Hoodie in brushed winter fleece — Woven`

---

## 3. Technical SEO Implementation

### 3.1 Dynamic Sitemap (`src/app/sitemap.ts`)

Create a Next.js App Router sitemap that auto-generates from Supabase product/collection data and includes `en-PK` hreflang annotations.

```ts
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://woven.pk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at');

  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0,
      alternates: { languages: { 'en-PK': `${BASE_URL}`, 'x-default': `${BASE_URL}` } } },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9,
      alternates: { languages: { 'en-PK': `${BASE_URL}/shop` } } },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8,
      alternates: { languages: { 'en-PK': `${BASE_URL}/collections` } } },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/size-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/legal/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.85,
    alternates: {
      languages: {
        'en-PK': `${BASE_URL}/products/${p.slug}`,
        'x-default': `${BASE_URL}/products/${p.slug}`,
      },
    },
  }));

  const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'weekly',
    priority: 0.75,
    alternates: {
      languages: {
        'en-PK': `${BASE_URL}/collections/${c.slug}`,
        'x-default': `${BASE_URL}/collections/${c.slug}`,
      },
    },
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
```

### 3.2 Dynamic OpenGraph Metadata — Product & Collection Pages

```ts
// src/app/products/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  return {
    title: `${product.name} — Woven`,
    description: product.shortDescription ?? product.description?.slice(0, 155),
    openGraph: {
      title: `${product.name} — Woven Pakistan`,
      description: product.description?.slice(0, 155),
      images: [{ url: product.imageUrl, width: 800, height: 1000, alt: product.name }],
      type: 'website',
      locale: 'en_PK',
      siteName: 'Woven',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Woven`,
      description: product.description?.slice(0, 155),
      images: [product.imageUrl],
    },
    alternates: {
      canonical: `https://woven.pk/products/${params.slug}`,
      languages: { 'en-PK': `https://woven.pk/products/${params.slug}` },
    },
  };
}
```

### 3.3 Root Layout Metadata (`src/app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://woven.pk'),
  title: {
    default: 'Woven — Ideas Stitched Into Reality',
    template: '%s — Woven',
  },
  description:
    'Theme-led clothing collections across Classic, Summer, and Winter: essentials, tees, formal layers, hoodies, jackets, and seasonal accessories.',
  keywords: [
    'Woven clothing', 'clothing brand Pakistan', 'minimal clothing Pakistan',
    'cotton t shirts Pakistan', 'hoodies Pakistan online', 'jackets Pakistan online',
    'formal waistcoat Pakistan', 'everyday essentials clothing', 'Woven Pakistan',
  ],
  authors: [{ name: 'Woven', url: 'https://woven.pk' }],
  creator: 'Woven',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://woven.pk',
    siteName: 'Woven',
    title: 'Woven — Ideas Stitched Into Reality',
    description: 'Plain essentials, summer pieces, formal edits, and winter layers by Woven.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Woven clothing collections' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wovenpk',
    creator: '@wovenpk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN',
  },
};
```

### 3.4 `robots.txt` (`public/robots.txt`)

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /_next/

Sitemap: https://woven.pk/sitemap.xml
```

### 3.5 Structured Data / JSON-LD

Add schema markup for product pages and the homepage to enable rich snippets in Google search.

**Homepage — Organization Schema:**
```tsx
// In layout.tsx or homepage component
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Woven",
  "url": "https://woven.pk",
  "logo": "https://woven.pk/logo.png",
  "sameAs": [
    "https://www.instagram.com/wovenpk",
    "https://www.facebook.com/wovenpk"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@woven.pk",
    "contactType": "customer service",
    "availableLanguage": ["English", "Urdu"],
    "areaServed": "PK"
  }
};
```

**Product Page — Product Schema:**
```tsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.imageUrl,
  "description": product.description,
  "brand": { "@type": "Brand", "name": "Woven" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "PKR",
    "price": product.price,
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Woven" }
  }
};
```

### 3.6 `llms.txt` (`public/llms.txt`)

```markdown
# Woven — LLM Context File
> Version: 1.0 | Last Updated: May 2026

## About Woven
Woven is a Pakistani direct-to-consumer clothing brand operating at https://woven.pk.
We sell theme-led apparel across Classic, Summer, and Winter collections, including
tees, shirts, pants, blazers, waistcoats, sets, hoodies, jackets, scarves, and seasonal
essentials. Products are priced in PKR and sold online.

## Brand Voice
Simple, confident, tactile, and modern. We speak about fit, fabric, movement, season,
and repeat wear. Avoid unrelated textile-heritage language, artisan claims, and generic
fashion filler such as "chic" or "trendy".

## Product Catalog Structure
Products belong to Collections, which belong to Themes.
- Themes: "Classic", "Summer", "Winter"
- Collections: e.g., "Plain Essentials", "Formal Edit", "Refined Basics", "Sky T-Shirts",
  "Light Pants", "Summer Sets", "Ice Hoodies", "Cold Air Jackets", "Winter Essentials"
- Products: Individual SKUs with name, slug, price (PKR), material, sizes, palette,
  status, collection, theme, product image, and optional hover image.

## Technical Stack
- Framework: Next.js 14 (App Router)
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage (bucket: product-images)
- Payments: Safepay (Pakistan-first payment gateway)
- Hosting: Vercel
- Auth: Supabase Auth (Google OAuth)

## Key Pages
- /shop — full product listing
- /collections — curated collections
- /products/[slug] — individual product pages
- /account/wishlist — authenticated wishlist
- /checkout — Safepay-powered checkout
- /faq — customer FAQs
- /size-guide — clothing measurements and fit guidance

## Contact
Email: hello@woven.pk
Instagram: @wovenpk
Location: Pakistan
```

---

## 4. Payment Gateway Migration (Safepay)

### 4.1 Environment Variables Required

Add to `.env.local` and Vercel environment settings:

```
SAFEPAY_API_KEY=your_safepay_api_key
SAFEPAY_SECRET_KEY=your_safepay_secret_key
SAFEPAY_ENVIRONMENT=sandbox  # change to "production" when live
NEXT_PUBLIC_SAFEPAY_ENV=sandbox
```

### 4.2 Files to Delete

- `src/app/api/create-payment-intent/route.ts` — Stripe payment intent route
- Remove `stripe` and `@stripe/react-stripe-js` from `package.json`

```bash
npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js
```

### 4.3 New File: `src/app/api/safepay/route.ts`

```ts
// src/app/api/safepay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SAFEPAY_BASE =
  process.env.SAFEPAY_ENVIRONMENT === 'production'
    ? 'https://api.getsafepay.com'
    : 'https://sandbox.api.getsafepay.com';

export async function POST(req: NextRequest) {
  const { amount, orderId, customerEmail } = await req.json();

  if (!amount || !orderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Step 1: Create a tracker (Safepay payment session)
    const trackerRes = await fetch(`${SAFEPAY_BASE}/order/v1/init/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SFPY-MERCHANT-SECRET': process.env.SAFEPAY_SECRET_KEY!,
      },
      body: JSON.stringify({
        merchant_api_key: process.env.SAFEPAY_API_KEY,
        intent: 'CYBERSOURCE',
        mode: 'payment',
        currency: 'PKR',
        amount: Math.round(amount * 100), // in paisas
      }),
    });

    if (!trackerRes.ok) {
      throw new Error(`Safepay tracker creation failed: ${trackerRes.statusText}`);
    }

    const { data: { tracker } } = await trackerRes.json();

    // Step 2: Build the checkout redirect URL
    const safepayEnv = process.env.SAFEPAY_ENVIRONMENT === 'production'
      ? 'https://checkout.getsafepay.com'
      : 'https://sandbox.checkout.getsafepay.com';

    const params = new URLSearchParams({
      env: process.env.SAFEPAY_ENVIRONMENT ?? 'sandbox',
      tracker: tracker.token,
      source: 'custom',
      order_id: orderId,
      ...(customerEmail && { email: customerEmail }),
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    });

    const checkoutUrl = `${safepayEnv}/embedded/?${params.toString()}`;

    return NextResponse.json({ checkoutUrl, trackerToken: tracker.token });
  } catch (err: any) {
    console.error('[Safepay API Error]', err);
    return NextResponse.json({ error: err.message ?? 'Payment initialization failed' }, { status: 500 });
  }
}
```

### 4.4 Modify `src/components/woven-client.tsx`

**Remove:**
- All `import` statements for `@stripe/react-stripe-js`, `@stripe/stripe-js`
- The `StripePaymentForm` component
- The `Elements` wrapper from Stripe

**Add SafepayCheckoutButton:**
```tsx
// Replace StripePaymentForm with:
const SafepayCheckoutButton = ({ cartTotal, orderId, customerEmail }: SafepayProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/safepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, orderId, customerEmail }),
      });
      const { checkoutUrl, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);
      window.location.href = checkoutUrl; // Redirect to Safepay hosted checkout
    } catch (err: any) {
      setError(err.message ?? 'Could not initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-stone-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Redirecting to Payment...' : `Pay PKR ${cartTotal.toLocaleString('en-PK')}`}
      </button>
      <p className="text-xs text-stone-400 text-center mt-2">
        Secured by <a href="https://getsafepay.com" target="_blank" rel="noopener noreferrer" className="underline">Safepay</a>
      </p>
    </div>
  );
};
```

### 4.5 Safepay Webhook Handler (`src/app/api/safepay/webhook/route.ts`)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-sfpy-signature') ?? '';

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.SAFEPAY_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  const supabase = createClient();

  if (event.type === 'payment:created') {
    const { tracker, order_id, amount } = event.data;
    await supabase.from('payments').upsert({
      order_id,
      tracker_token: tracker.token,
      amount: amount / 100,
      status: 'paid',
      paid_at: new Date().toISOString(),
    });
    await supabase.from('orders').update({ status: 'confirmed' }).eq('id', order_id);
  }

  return NextResponse.json({ received: true });
}
```

---

## 5. Backend & Database (Supabase)

### 5.1 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # only in server/scripts, never expose client-side
```

### 5.2 Required Database Tables (SQL Migration)

```sql
-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  shipping_address JSONB,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  tracker_token TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  gateway TEXT DEFAULT 'safepay',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5.3 Seed Script (`scripts/seed-supabase.ts`)

```ts
// scripts/seed-supabase.ts
// Run with: npx ts-node scripts/seed-supabase.ts
import { createClient } from '@supabase/supabase-js';
import { fallbackThemes, fallbackCollections, fallbackProducts } from '../src/lib/woven-data';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // bypasses RLS
);

async function seed() {
  console.log('🌱 Starting Woven database seed...');

  // 1. Seed themes
  const { error: themeError } = await supabase
    .from('themes')
    .upsert(fallbackThemes, { onConflict: 'slug' });
  if (themeError) throw themeError;
  console.log(`✅ Seeded ${fallbackThemes.length} themes`);

  // 2. Seed collections
  const { error: colError } = await supabase
    .from('collections')
    .upsert(fallbackCollections, { onConflict: 'slug' });
  if (colError) throw colError;
  console.log(`✅ Seeded ${fallbackCollections.length} collections`);

  // 3. Seed products + upload images
  for (const product of fallbackProducts) {
    // Upload placeholder image if exists locally
    const imagePath = path.join(__dirname, '../public/products', `${product.slug}.jpg`);
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`${product.slug}.jpg`, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (uploadError) console.warn(`  ⚠️ Image upload failed for ${product.slug}:`, uploadError.message);
      else console.log(`  📸 Uploaded image for ${product.slug}`);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`${product.slug}.jpg`);

      product.imageUrl = publicUrl;
    }

    const { error: productError } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' });
    if (productError) throw productError;
  }

  console.log(`✅ Seeded ${fallbackProducts.length} products`);
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
```

Add to `package.json`:
```json
"scripts": {
  "seed": "ts-node --project tsconfig.scripts.json scripts/seed-supabase.ts"
}
```

### 5.4 Supabase Storage Setup

In the Supabase Dashboard:
1. Create bucket: `product-images`
2. Set to **Public** (read access for all, write only via service role)
3. Add CORS policy to allow `woven.pk` and `woven-psi.vercel.app`

---

## 6. LLM & AI Integration

## 7. Code Cleanup & Optimization

### 7.1 Files to Delete

| File/Directory | Reason |
|---------------|--------|
| `src/app/api/create-payment-intent/route.ts` | Replaced by Safepay |
| Any `.bak`, `.old`, `*.test.tsx` placeholder files | Dead code |
| Unused icon/SVG assets in `public/` | Reduce bundle |

### 7.2 Dependencies to Remove

```bash
npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js
```

Estimated bundle saving: **~100–130 KB gzipped**

### 7.3 `next/image` Migration Checklist

Search codebase for all `<img` tags and replace:

```bash
# Find all raw img tags
grep -rn "<img " src/ --include="*.tsx" --include="*.ts"
```

Replace each with `<Image />` from `next/image` with proper `width`, `height`, and `alt` attributes. Target: **zero linter warnings** for img tags.

### 7.4 Font Payload Pruning

Audit `layout.tsx` — if loading more than 2–3 font families or more than 4 weights, prune aggressively. A typical Woven apparel page needs:
- **Display font** (Playfair Display or Cormorant Garamond) — Regular + SemiBold only
- **Body font** (Inter or DM Sans) — Regular + Medium only

### 7.5 Unused Component Audit

Check and remove if unused:
- Any placeholder modal components
- Stripe-specific type definitions or hooks
- Test/debug `console.log` statements throughout

```bash
# Find console.log statements
grep -rn "console.log" src/ --include="*.tsx" --include="*.ts"
```

---

## 8. Authentication

### 8.1 Google OAuth via Supabase

In Supabase Dashboard → Authentication → Providers → Google:
1. Enable Google provider
2. Add OAuth Client ID and Secret from Google Cloud Console
3. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add `https://woven.pk` and `https://woven-psi.vercel.app` to authorized origins in Google Console

### 8.2 Auth-Gated Routes

Protect `/account/wishlist` and `/account/orders` using Supabase server-side session checking:

```ts
// src/app/account/wishlist/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function WishlistPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/account/login?next=/account/wishlist');
  // ... render wishlist
}
```

---

## 9. Content & Copywriting

### 9.1 Legal & Informational Pages

All pages currently have placeholder text. Update in `woven-client.tsx` (around line 1209):

| Page | Action Required |
|------|----------------|
| `/faq` | Write 10–15 real FAQs covering shipping, returns, clothing care, sizing, payment methods, Safepay support |
| `/terms` | Draft Terms of Service with Pakistani jurisdiction clause (Karachi courts), PKR currency, delivery SLA |
| `/privacy` | GDPR-lite policy + PTA compliance for Pakistan. Cover data storage (Supabase/Vercel), email usage |
| `/legal/returns` | 14-day return policy, condition requirements, how to initiate, refund timeline (5–7 business days to bank) |
| `/size-guide` | Real garment measurements for tees, shirts, pants, blazers, hoodies, jackets, sets, and one-size accessories |

### 9.2 Contact Page — Functional Form

Replace static email display with a working contact form:

**Option A (Recommended) — Resend:**
```ts
// src/app/api/contact/route.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Woven Contact <noreply@woven.pk>',
  to: 'hello@woven.pk',
  subject: `Contact Form: ${name}`,
  html: `<p>From: ${name} (${email})</p><p>Message: ${message}</p>`,
});
```

**Option B — Formspree:** `<form action="https://formspree.io/f/YOUR_ID" method="POST">`

### 9.3 Missing OG Image

Create a 1200×630px image at `public/og-image.jpg` to be used as the default Open Graph share image for all pages. Should feature the Woven logo, a hero product image, and the tagline.

---

## 10. Developer Execution Checklist

Use this as a sequential task list for the development sprint.

### Phase 1 — Foundation (Week 1)
- [ ] Add all missing environment variables to `.env.local` and Vercel
- [ ] Run Supabase SQL migrations (orders, order_items, payments tables)
- [ ] Create Supabase Storage bucket `product-images` with public read policy
- [x] Remove Stripe: `npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js`
- [x] Delete `src/app/api/create-payment-intent/route.ts`

### Phase 2 — Core Features (Week 1–2)
- [x] Implement `src/app/api/safepay/route.ts`
- [x] Implement `src/app/api/safepay/webhook/route.ts`
- [x] Replace `StripePaymentForm` with `SafepayCheckoutButton` in `woven-client.tsx`
- [ ] Test Safepay sandbox checkout end-to-end
- [ ] Implement `scripts/seed-supabase.ts` and run `npm run seed`
- [ ] Verify seeded data and images in Supabase dashboard

### Phase 3 — SEO & Performance (Week 2)
- [x] Implement `src/app/sitemap.ts` with hreflang `en-PK` tags
- [x] Add `public/robots.txt`
- [x] Add `public/llms.txt`
- [x] Update `src/app/layout.tsx` with full root metadata
- [x] Add dynamic `generateMetadata` to `/products/[slug]` and `/collections/[slug]`
- [x] Add JSON-LD structured data to homepage and product pages
- [x] Migrate fonts to `next/font/google`

### Phase 4 — Performance (Week 2–3)
- [x] Replace all 12 `<img>` tags with `<Image />` from `next/image`
- [x] Add `priority` to hero image
- [x] Add `aspect-ratio` to all product card image containers
- [x] Add `<link rel="preload">` for LCP hero image
- [ ] Run Lighthouse — target Performance ≥ 95, CLS ≤ 0.1
- [ ] Run `npx @next/bundle-analyzer` and address any outliers

### Phase 5 — Auth, Content & Cleanup (Week 3)
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Add server-side auth guard to `/account/*` routes
- [x] Write real FAQ copy (10–15 questions)
- [x] Write Terms, Privacy, Returns legal pages
- [x] Write real Size Guide content
- [x] Build functional contact form (Resend or Formspree)
- [ ] Create `public/og-image.jpg` (1200×630px)
- [x] Remove all unused files and `console.log` statements
- [ ] Final Lighthouse audit — confirm all scores ≥ 95

### Phase 6 — AI Features (Phase 2, Post-Launch)
- [ ] Build `AIShoppingAssistant` component using Claude API
- [ ] Add AI-generated product descriptions to seed script
- [ ] A/B test AI assistant conversion impact

---

*This document is the single source of truth for the Woven production readiness sprint. Update task checkboxes as items are completed and re-share with the development team.*# Woven — Master Improvement & Refinement Plan
**Site:** https://woven-psi.vercel.app/  
**Last Updated:** May 2026  
**Status:** Pre-Production → Production-Ready Roadmap

---

## Table of Contents
1. [Performance Targets](#1-performance-targets)
2. [SEO Strategy & Keyword Plan](#2-seo-strategy--keyword-plan)
3. [Technical SEO Implementation](#3-technical-seo-implementation)
4. [Payment Gateway Migration (Safepay)](#4-payment-gateway-migration-safepay)
5. [Backend & Database (Supabase)](#5-backend--database-supabase)
6. [LLM & AI Integration](#6-llm--ai-integration)
7. [Code Cleanup & Optimization](#7-code-cleanup--optimization)
8. [Authentication](#8-authentication)
9. [Content & Copywriting](#9-content--copywriting)
10. [Developer Execution Checklist](#10-developer-execution-checklist)

---

## 1. Performance Targets

### Core Web Vitals — Required Scores (Lighthouse / PageSpeed Insights)

| Metric | Target | Current Estimate | Notes |
|--------|--------|-----------------|-------|
| **Performance Score** | ≥ 95 | ~60–70 (est.) | Blocked by unoptimized images, large font payload |
| **Accessibility Score** | ≥ 95 | ~80 (est.) | Missing alt tags, ARIA labels |
| **Best Practices Score** | ≥ 95 | ~85 (est.) | HTTP/2, no mixed content |
| **SEO Score** | ≥ 100 | ~70 (est.) | Missing meta, hreflang, sitemap |
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | ~4–5s (est.) | Hero image not preloaded |
| **FID / INP (Interaction to Next Paint)** | ≤ 200ms | Unknown | Stripe JS may block |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | ~0.2 (est.) | Images without fixed dimensions |
| **FCP (First Contentful Paint)** | ≤ 1.8s | ~3s (est.) | Font preload needed |
| **TTFB (Time to First Byte)** | ≤ 800ms | ~600ms (est.) | Vercel Edge — acceptable |

### Action Items to Hit Targets

#### 1.1 Image Optimization (CRITICAL — biggest LCP/CLS impact)
- **Replace all `<img>` tags with Next.js `<Image />`** component. There are currently **12 linter warnings** for raw `<img>` usage.
- Always set explicit `width` and `height` props to prevent CLS.
- Use `priority` prop on the above-the-fold hero image to trigger LCP preloading.
- Use `sizes` attribute for responsive images: `sizes="(max-width: 768px) 100vw, 50vw"`.
- Serve images from Supabase Storage with automatic WebP conversion where possible.
- Add a `<link rel="preload" as="image" href="/hero.webp">` in `<head>` for the hero.

```tsx
// ❌ Wrong
<img src="/products/tee.jpg" alt="Tee" />

// ✅ Correct
import Image from 'next/image';
<Image
  src="/products/clean-crew-tee.jpg"
  alt="Clean Crew Tee in heavyweight cotton jersey — Woven"
  width={800}
  height={1000}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority // only for above-the-fold
/>
```

#### 1.2 Font Optimization (FCP Impact)
- Audit `layout.tsx` — remove unused font families.
- Migrate to `next/font/google` for automatic subsetting and zero layout shift:

```tsx
// ✅ In layout.tsx
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-inter',
});
```

#### 1.3 Bundle Size Reduction
- Remove `stripe` and `@stripe/react-stripe-js` after Safepay migration (saves ~80–120 KB gzipped).
- Run `npx @next/bundle-analyzer` to identify other heavy modules.
- Ensure dynamic imports for any modal/drawer components not needed on initial load:

```tsx
const CheckoutModal = dynamic(() => import('./CheckoutModal'), { ssr: false });
```

#### 1.4 CLS Fixes
- Every product card image must have fixed aspect ratios via CSS or explicit `width`/`height`.
- Use `aspect-ratio: 3/4` on image containers to reserve space before load.
- Avoid inserting banners or modals that push content down after load.

---

## 2. SEO Strategy & Keyword Plan

### Brand Context
Woven is a Pakistani direct-to-consumer clothing brand selling theme-led essentials online at `woven-psi.vercel.app` (to be migrated to `woven.pk`). The current storefront is organized around Classic, Summer, and Winter worlds, with plain essentials, formal edits, refined basics, tees, pants, sets, hoodies, jackets, and winter accessories.

### 2.1 Page-Level Title & Meta Description Targets

| Page | Recommended `<title>` Tag | Recommended Meta Description |
|------|--------------------------|------------------------------|
| **Homepage** | `Woven — Ideas Stitched Into Reality` | `Explore Woven's theme-led clothing collections across Classic, Summer, and Winter: everyday tees, shirts, pants, formal layers, hoodies, jackets, and accessories.` |
| **Shop / All Products** | `Shop Woven Clothing — Everyday Essentials & Seasonal Layers` | `Browse Woven clothing by fit, fabric, theme, and season. Shop tees, shirts, pants, blazers, hoodies, jackets, sets, scarves, and repeat-wear essentials.` |
| **Collections** | `Collections — Woven Classic, Summer & Winter Edits` | `Explore Woven collections across Plain Essentials, Formal Edit, Refined Basics, summer pieces, cold-air jackets, hoodies, and winter essentials.` |
| **Product Detail Page** | `[Product Name] — Woven` (e.g., `Clean Crew Tee — Woven`) | Dynamic: pulled from product description. Min 120 chars, max 160. |
| **About** | `About Woven — Theme-Led Clothing Essentials` | `Woven creates simple, considered clothing for daily wear, warm days, polished moments, and cold-weather layering.` |
| **FAQ** | `Frequently Asked Questions — Woven` | `Find answers to common questions about Woven's delivery policy, returns, fabric care, sizing, and payment options.` |
| **Contact** | `Contact Woven — Get in Touch` | `Reach out to the Woven team for order support, wholesale inquiries, or press collaboration. We respond within 24 hours.` |
| **Size Guide** | `Size Guide — Woven Clothing Fits & Measurements` | `Use Woven's size guide for tees, shirts, pants, blazers, hoodies, jackets, sets, and one-size accessories.` |
| **Returns & Legal** | `Shipping & Returns — Woven` | `Review Woven delivery, exchange, return, privacy, and terms details before placing your order.` |

### 2.2 Primary Keyword Targets

These keywords should appear naturally in page headings (H1, H2), product descriptions, alt text, and metadata.

#### Tier 1 — High Intent, Commercial
| Keyword | Monthly Searches (PK est.) | Target Page |
|---------|--------------------------|-------------|
| `minimal clothing Pakistan` | Research in GSC/Keyword Planner | Homepage, Shop |
| `men essentials clothing Pakistan` | Research in GSC/Keyword Planner | Shop, Product pages |
| `cotton t shirts Pakistan` | Research in GSC/Keyword Planner | Shop, Product pages |
| `hoodies Pakistan online` | Research in GSC/Keyword Planner | Winter collections |
| `jackets Pakistan online` | Research in GSC/Keyword Planner | Winter collections |
| `formal waistcoat Pakistan` | Research in GSC/Keyword Planner | Formal Edit |
| `blazer Pakistan online` | Research in GSC/Keyword Planner | Formal Edit |
| `Woven clothing Pakistan` | Branded | Homepage, About |

#### Tier 2 — Informational / Long-Tail
| Keyword | Intent | Target Page |
|---------|--------|-------------|
| `how to wash cotton t shirts` | Informational | FAQ, Product pages |
| `how should a hoodie fit` | Informational | Size Guide, Product pages |
| `men clothing size guide Pakistan` | Informational | Size Guide |
| `best everyday clothing Pakistan` | Commercial | Homepage, Shop |
| `minimal wardrobe essentials Pakistan` | Commercial | Collections |
| `winter layers Pakistan online` | Transactional | Winter collections |

#### Tier 3 — Local & Regional
| Keyword | Target |
|---------|--------|
| `clothing brand Lahore online` | Homepage, Shop |
| `Karachi clothing delivery` | Shipping, Shop |
| `online clothing store Pakistan` | Homepage, Shop |
| `woven clothing Pakistan` | Branded — Homepage |
| `woven.pk` | Branded — all pages |

### 2.3 H1 / H2 Heading Guidelines

- **Homepage H1:** `Woven`
- **Shop H1:** `Shop Woven`
- **Collection H1 (dynamic):** `[Collection Name] — Woven Collection`
- **Product H1 (dynamic):** `[Product Name]` — always include the exact catalog product name.
- **About H1:** `We Are Woven.`

### 2.4 Alt Text Guidelines

Every product image alt tag must follow this pattern:  
`[product name] [product type or fit] in [material/color/use case] — [brand]`

**Examples:**
- `Clean Crew Tee in heavyweight cotton jersey — Woven`
- `Soft Structure Blazer with natural shoulders — Woven`
- `Frostline Hoodie in brushed winter fleece — Woven`

---

## 3. Technical SEO Implementation

### 3.1 Dynamic Sitemap (`src/app/sitemap.ts`)

Create a Next.js App Router sitemap that auto-generates from Supabase product/collection data and includes `en-PK` hreflang annotations.

```ts
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://woven.pk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at');

  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0,
      alternates: { languages: { 'en-PK': `${BASE_URL}`, 'x-default': `${BASE_URL}` } } },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9,
      alternates: { languages: { 'en-PK': `${BASE_URL}/shop` } } },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8,
      alternates: { languages: { 'en-PK': `${BASE_URL}/collections` } } },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/size-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/legal/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.85,
    alternates: {
      languages: {
        'en-PK': `${BASE_URL}/products/${p.slug}`,
        'x-default': `${BASE_URL}/products/${p.slug}`,
      },
    },
  }));

  const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: 'weekly',
    priority: 0.75,
    alternates: {
      languages: {
        'en-PK': `${BASE_URL}/collections/${c.slug}`,
        'x-default': `${BASE_URL}/collections/${c.slug}`,
      },
    },
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
```

### 3.2 Dynamic OpenGraph Metadata — Product & Collection Pages

```ts
// src/app/products/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  return {
    title: `${product.name} — Woven`,
    description: product.shortDescription ?? product.description?.slice(0, 155),
    openGraph: {
      title: `${product.name} — Woven Pakistan`,
      description: product.description?.slice(0, 155),
      images: [{ url: product.imageUrl, width: 800, height: 1000, alt: product.name }],
      type: 'website',
      locale: 'en_PK',
      siteName: 'Woven',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Woven`,
      description: product.description?.slice(0, 155),
      images: [product.imageUrl],
    },
    alternates: {
      canonical: `https://woven.pk/products/${params.slug}`,
      languages: { 'en-PK': `https://woven.pk/products/${params.slug}` },
    },
  };
}
```

### 3.3 Root Layout Metadata (`src/app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://woven.pk'),
  title: {
    default: 'Woven — Ideas Stitched Into Reality',
    template: '%s — Woven',
  },
  description:
    'Theme-led clothing collections across Classic, Summer, and Winter: essentials, tees, formal layers, hoodies, jackets, and seasonal accessories.',
  keywords: [
    'Woven clothing', 'clothing brand Pakistan', 'minimal clothing Pakistan',
    'cotton t shirts Pakistan', 'hoodies Pakistan online', 'jackets Pakistan online',
    'formal waistcoat Pakistan', 'everyday essentials clothing', 'Woven Pakistan',
  ],
  authors: [{ name: 'Woven', url: 'https://woven.pk' }],
  creator: 'Woven',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://woven.pk',
    siteName: 'Woven',
    title: 'Woven — Ideas Stitched Into Reality',
    description: 'Plain essentials, summer pieces, formal edits, and winter layers by Woven.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Woven clothing collections' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wovenpk',
    creator: '@wovenpk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN',
  },
};
```

### 3.4 `robots.txt` (`public/robots.txt`)

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /account/
Disallow: /_next/

Sitemap: https://woven.pk/sitemap.xml
```

### 3.5 Structured Data / JSON-LD

Add schema markup for product pages and the homepage to enable rich snippets in Google search.

**Homepage — Organization Schema:**
```tsx
// In layout.tsx or homepage component
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Woven",
  "url": "https://woven.pk",
  "logo": "https://woven.pk/logo.png",
  "sameAs": [
    "https://www.instagram.com/wovenpk",
    "https://www.facebook.com/wovenpk"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@woven.pk",
    "contactType": "customer service",
    "availableLanguage": ["English", "Urdu"],
    "areaServed": "PK"
  }
};
```

**Product Page — Product Schema:**
```tsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.imageUrl,
  "description": product.description,
  "brand": { "@type": "Brand", "name": "Woven" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "PKR",
    "price": product.price,
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Woven" }
  }
};
```

### 3.6 `llms.txt` (`public/llms.txt`)

```markdown
# Woven — LLM Context File
> Version: 1.0 | Last Updated: May 2026

## About Woven
Woven is a Pakistani direct-to-consumer clothing brand operating at https://woven.pk.
We sell theme-led apparel across Classic, Summer, and Winter collections, including
tees, shirts, pants, blazers, waistcoats, sets, hoodies, jackets, scarves, and seasonal
essentials. Products are priced in PKR and sold online.

## Brand Voice
Simple, confident, tactile, and modern. We speak about fit, fabric, movement, season,
and repeat wear. Avoid unrelated textile-heritage language, artisan claims, and generic
fashion filler such as "chic" or "trendy".

## Product Catalog Structure
Products belong to Collections, which belong to Themes.
- Themes: "Classic", "Summer", "Winter"
- Collections: e.g., "Plain Essentials", "Formal Edit", "Refined Basics", "Sky T-Shirts",
  "Light Pants", "Summer Sets", "Ice Hoodies", "Cold Air Jackets", "Winter Essentials"
- Products: Individual SKUs with name, slug, price (PKR), material, sizes, palette,
  status, collection, theme, product image, and optional hover image.

## Technical Stack
- Framework: Next.js 14 (App Router)
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage (bucket: product-images)
- Payments: Safepay (Pakistan-first payment gateway)
- Hosting: Vercel
- Auth: Supabase Auth (Google OAuth)

## Key Pages
- /shop — full product listing
- /collections — curated collections
- /products/[slug] — individual product pages
- /account/wishlist — authenticated wishlist
- /checkout — Safepay-powered checkout
- /faq — customer FAQs
- /size-guide — clothing measurements and fit guidance

## Contact
Email: hello@woven.pk
Instagram: @wovenpk
Location: Pakistan
```

---

## 4. Payment Gateway Migration (Safepay)

### 4.1 Environment Variables Required

Add to `.env.local` and Vercel environment settings:

```
SAFEPAY_API_KEY=your_safepay_api_key
SAFEPAY_SECRET_KEY=your_safepay_secret_key
SAFEPAY_ENVIRONMENT=sandbox  # change to "production" when live
NEXT_PUBLIC_SAFEPAY_ENV=sandbox
```

### 4.2 Files to Delete

- `src/app/api/create-payment-intent/route.ts` — Stripe payment intent route
- Remove `stripe` and `@stripe/react-stripe-js` from `package.json`

```bash
npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js
```

### 4.3 New File: `src/app/api/safepay/route.ts`

```ts
// src/app/api/safepay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SAFEPAY_BASE =
  process.env.SAFEPAY_ENVIRONMENT === 'production'
    ? 'https://api.getsafepay.com'
    : 'https://sandbox.api.getsafepay.com';

export async function POST(req: NextRequest) {
  const { amount, orderId, customerEmail } = await req.json();

  if (!amount || !orderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Step 1: Create a tracker (Safepay payment session)
    const trackerRes = await fetch(`${SAFEPAY_BASE}/order/v1/init/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SFPY-MERCHANT-SECRET': process.env.SAFEPAY_SECRET_KEY!,
      },
      body: JSON.stringify({
        merchant_api_key: process.env.SAFEPAY_API_KEY,
        intent: 'CYBERSOURCE',
        mode: 'payment',
        currency: 'PKR',
        amount: Math.round(amount * 100), // in paisas
      }),
    });

    if (!trackerRes.ok) {
      throw new Error(`Safepay tracker creation failed: ${trackerRes.statusText}`);
    }

    const { data: { tracker } } = await trackerRes.json();

    // Step 2: Build the checkout redirect URL
    const safepayEnv = process.env.SAFEPAY_ENVIRONMENT === 'production'
      ? 'https://checkout.getsafepay.com'
      : 'https://sandbox.checkout.getsafepay.com';

    const params = new URLSearchParams({
      env: process.env.SAFEPAY_ENVIRONMENT ?? 'sandbox',
      tracker: tracker.token,
      source: 'custom',
      order_id: orderId,
      ...(customerEmail && { email: customerEmail }),
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    });

    const checkoutUrl = `${safepayEnv}/embedded/?${params.toString()}`;

    return NextResponse.json({ checkoutUrl, trackerToken: tracker.token });
  } catch (err: any) {
    console.error('[Safepay API Error]', err);
    return NextResponse.json({ error: err.message ?? 'Payment initialization failed' }, { status: 500 });
  }
}
```

### 4.4 Modify `src/components/woven-client.tsx`

**Remove:**
- All `import` statements for `@stripe/react-stripe-js`, `@stripe/stripe-js`
- The `StripePaymentForm` component
- The `Elements` wrapper from Stripe

**Add SafepayCheckoutButton:**
```tsx
// Replace StripePaymentForm with:
const SafepayCheckoutButton = ({ cartTotal, orderId, customerEmail }: SafepayProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/safepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal, orderId, customerEmail }),
      });
      const { checkoutUrl, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);
      window.location.href = checkoutUrl; // Redirect to Safepay hosted checkout
    } catch (err: any) {
      setError(err.message ?? 'Could not initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-stone-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Redirecting to Payment...' : `Pay PKR ${cartTotal.toLocaleString('en-PK')}`}
      </button>
      <p className="text-xs text-stone-400 text-center mt-2">
        Secured by <a href="https://getsafepay.com" target="_blank" rel="noopener noreferrer" className="underline">Safepay</a>
      </p>
    </div>
  );
};
```

### 4.5 Safepay Webhook Handler (`src/app/api/safepay/webhook/route.ts`)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-sfpy-signature') ?? '';

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', process.env.SAFEPAY_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);
  const supabase = createClient();

  if (event.type === 'payment:created') {
    const { tracker, order_id, amount } = event.data;
    await supabase.from('payments').upsert({
      order_id,
      tracker_token: tracker.token,
      amount: amount / 100,
      status: 'paid',
      paid_at: new Date().toISOString(),
    });
    await supabase.from('orders').update({ status: 'confirmed' }).eq('id', order_id);
  }

  return NextResponse.json({ received: true });
}
```

---

## 5. Backend & Database (Supabase)

### 5.1 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # only in server/scripts, never expose client-side
```

### 5.2 Required Database Tables (SQL Migration)

```sql
-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  shipping_address JSONB,
  customer_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  tracker_token TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  gateway TEXT DEFAULT 'safepay',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5.3 Seed Script (`scripts/seed-supabase.ts`)

```ts
// scripts/seed-supabase.ts
// Run with: npx ts-node scripts/seed-supabase.ts
import { createClient } from '@supabase/supabase-js';
import { fallbackThemes, fallbackCollections, fallbackProducts } from '../src/lib/woven-data';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // bypasses RLS
);

async function seed() {
  console.log('🌱 Starting Woven database seed...');

  // 1. Seed themes
  const { error: themeError } = await supabase
    .from('themes')
    .upsert(fallbackThemes, { onConflict: 'slug' });
  if (themeError) throw themeError;
  console.log(`✅ Seeded ${fallbackThemes.length} themes`);

  // 2. Seed collections
  const { error: colError } = await supabase
    .from('collections')
    .upsert(fallbackCollections, { onConflict: 'slug' });
  if (colError) throw colError;
  console.log(`✅ Seeded ${fallbackCollections.length} collections`);

  // 3. Seed products + upload images
  for (const product of fallbackProducts) {
    // Upload placeholder image if exists locally
    const imagePath = path.join(__dirname, '../public/products', `${product.slug}.jpg`);
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`${product.slug}.jpg`, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (uploadError) console.warn(`  ⚠️ Image upload failed for ${product.slug}:`, uploadError.message);
      else console.log(`  📸 Uploaded image for ${product.slug}`);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`${product.slug}.jpg`);

      product.imageUrl = publicUrl;
    }

    const { error: productError } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' });
    if (productError) throw productError;
  }

  console.log(`✅ Seeded ${fallbackProducts.length} products`);
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
```

Add to `package.json`:
```json
"scripts": {
  "seed": "ts-node --project tsconfig.scripts.json scripts/seed-supabase.ts"
}
```

### 5.4 Supabase Storage Setup

In the Supabase Dashboard:
1. Create bucket: `product-images`
2. Set to **Public** (read access for all, write only via service role)
3. Add CORS policy to allow `woven.pk` and `woven-psi.vercel.app`

---

## 6. LLM & AI Integration

### 6.1 AI Shopping Assistant (Phase 2)

A conversational product assistant powered by the Claude API embedded in the site sidebar or as a chat widget.

**Use cases:**
- "I need an everyday tee and pants under PKR 10,000"
- "Which hoodie or jacket works best for cold evenings?"
- "Do you have a polished layer for dinner or an event?"

**Implementation approach:**
- Use the Anthropic Claude API (`claude-sonnet-4-20250514`) with a system prompt describing the product catalog
- Stream responses using the `stream: true` option for a snappy UX
- Inject the current product catalog as context in the system prompt (keep under 4K tokens)
- Component: `src/components/AIShoppingAssistant.tsx` — lazy-loaded, opens as a bottom sheet on mobile

### 6.2 Dynamic Product Description Generation

Use Claude to auto-generate SEO-optimized product descriptions from structured product data fields during the seed process.

```ts
// In seed script — generate descriptions with Claude
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY! },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Write a product description (100 words max) for an e-commerce listing for:
        Product: ${product.name}
        Material: ${product.material}
        Origin: ${product.region}
        Price: PKR ${product.price}
        Brand voice: Warm, culturally proud, premium but accessible.
        End with one care instruction sentence.`
    }]
  })
});
```

---

## 7. Code Cleanup & Optimization

### 7.1 Files to Delete

| File/Directory | Reason |
|---------------|--------|
| `src/app/api/create-payment-intent/route.ts` | Replaced by Safepay |
| Any `.bak`, `.old`, `*.test.tsx` placeholder files | Dead code |
| Unused icon/SVG assets in `public/` | Reduce bundle |

### 7.2 Dependencies to Remove

```bash
npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js
```

Estimated bundle saving: **~100–130 KB gzipped**

### 7.3 `next/image` Migration Checklist

Search codebase for all `<img` tags and replace:

```bash
# Find all raw img tags
grep -rn "<img " src/ --include="*.tsx" --include="*.ts"
```

Replace each with `<Image />` from `next/image` with proper `width`, `height`, and `alt` attributes. Target: **zero linter warnings** for img tags.

### 7.4 Font Payload Pruning

Audit `layout.tsx` — if loading more than 2–3 font families or more than 4 weights, prune aggressively. A typical Woven apparel page needs:
- **Display font** (Playfair Display or Cormorant Garamond) — Regular + SemiBold only
- **Body font** (Inter or DM Sans) — Regular + Medium only

### 7.5 Unused Component Audit

Check and remove if unused:
- Any placeholder modal components
- Stripe-specific type definitions or hooks
- Test/debug `console.log` statements throughout

```bash
# Find console.log statements
grep -rn "console.log" src/ --include="*.tsx" --include="*.ts"
```

---

## 8. Authentication

### 8.1 Google OAuth via Supabase

In Supabase Dashboard → Authentication → Providers → Google:
1. Enable Google provider
2. Add OAuth Client ID and Secret from Google Cloud Console
3. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add `https://woven.pk` and `https://woven-psi.vercel.app` to authorized origins in Google Console

### 8.2 Auth-Gated Routes

Protect `/account/wishlist` and `/account/orders` using Supabase server-side session checking:

```ts
// src/app/account/wishlist/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function WishlistPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/account/login?next=/account/wishlist');
  // ... render wishlist
}
```

---

## 9. Content & Copywriting

### 9.1 Legal & Informational Pages

All pages currently have placeholder text. Update in `woven-client.tsx` (around line 1209):

| Page | Action Required |
|------|----------------|
| `/faq` | Write 10–15 real FAQs covering shipping, returns, clothing care, sizing, payment methods, Safepay support |
| `/terms` | Draft Terms of Service with Pakistani jurisdiction clause (Karachi courts), PKR currency, delivery SLA |
| `/privacy` | GDPR-lite policy + PTA compliance for Pakistan. Cover data storage (Supabase/Vercel), email usage |
| `/legal/returns` | 14-day return policy, condition requirements, how to initiate, refund timeline (5–7 business days to bank) |
| `/size-guide` | Real garment measurements for tees, shirts, pants, blazers, hoodies, jackets, sets, and one-size accessories |

### 9.2 Contact Page — Functional Form

Replace static email display with a working contact form:

**Option A (Recommended) — Resend:**
```ts
// src/app/api/contact/route.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Woven Contact <noreply@woven.pk>',
  to: 'hello@woven.pk',
  subject: `Contact Form: ${name}`,
  html: `<p>From: ${name} (${email})</p><p>Message: ${message}</p>`,
});
```

**Option B — Formspree:** `<form action="https://formspree.io/f/YOUR_ID" method="POST">`

### 9.3 Missing OG Image

Create a 1200×630px image at `public/og-image.jpg` to be used as the default Open Graph share image for all pages. Should feature the Woven logo, a hero product image, and the tagline.

---

## 10. Developer Execution Checklist

Use this as a sequential task list for the development sprint.

### Phase 1 — Foundation (Week 1)
- [ ] Add all missing environment variables to `.env.local` and Vercel
- [ ] Run Supabase SQL migrations (orders, order_items, payments tables)
- [ ] Create Supabase Storage bucket `product-images` with public read policy
- [x] Remove Stripe: `npm uninstall stripe @stripe/react-stripe-js @stripe/stripe-js`
- [x] Delete `src/app/api/create-payment-intent/route.ts`

### Phase 2 — Core Features (Week 1–2)
- [x] Implement `src/app/api/safepay/route.ts`
- [x] Implement `src/app/api/safepay/webhook/route.ts`
- [x] Replace `StripePaymentForm` with `SafepayCheckoutButton` in `woven-client.tsx`
- [ ] Test Safepay sandbox checkout end-to-end
- [ ] Implement `scripts/seed-supabase.ts` and run `npm run seed`
- [ ] Verify seeded data and images in Supabase dashboard

### Phase 3 — SEO & Performance (Week 2)
- [x] Implement `src/app/sitemap.ts` with hreflang `en-PK` tags
- [x] Add `public/robots.txt`
- [x] Add `public/llms.txt`
- [x] Update `src/app/layout.tsx` with full root metadata
- [x] Add dynamic `generateMetadata` to `/products/[slug]` and `/collections/[slug]`
- [x] Add JSON-LD structured data to homepage and product pages
- [x] Migrate fonts to `next/font/google`

### Phase 4 — Performance (Week 2–3)
- [x] Replace all 12 `<img>` tags with `<Image />` from `next/image`
- [x] Add `priority` to hero image
- [x] Add `aspect-ratio` to all product card image containers
- [x] Add `<link rel="preload">` for LCP hero image
- [ ] Run Lighthouse — target Performance ≥ 95, CLS ≤ 0.1
- [ ] Run `npx @next/bundle-analyzer` and address any outliers

### Phase 5 — Auth, Content & Cleanup (Week 3)
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Add server-side auth guard to `/account/*` routes
- [x] Write real FAQ copy (10–15 questions)
- [x] Write Terms, Privacy, Returns legal pages
- [x] Write real Size Guide content
- [x] Build functional contact form (Resend or Formspree)
- [ ] Create `public/og-image.jpg` (1200×630px)
- [x] Remove all unused files and `console.log` statements
- [ ] Final Lighthouse audit — confirm all scores ≥ 95

### Phase 6 — AI Features (Phase 2, Post-Launch)
- [ ] Build `AIShoppingAssistant` component using Claude API
- [ ] Add AI-generated product descriptions to seed script
- [ ] A/B test AI assistant conversion impact

---

*This document is the single source of truth for the Woven production readiness sprint. Update task checkboxes as items are completed and re-share with the development team.*
