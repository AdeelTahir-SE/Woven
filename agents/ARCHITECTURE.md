# WOVEN — Site Architecture
### *Ideas Stitched Into Reality*

---

## 1. Site Structure Tree

```
woven.com/
│
├── / ................................. Home
│   ├── #hero ........................ Hero — Full Viewport
│   ├── #collections-strip ........... Collection Nav Pills
│   ├── #thread-classics ............. Collection 01 — Thread Classics
│   ├── #minimal-edit ................ Collection 02 — Minimal Edit
│   ├── #digital-weave ............... Collection 03 — Digital Weave
│   ├── #street-stitch ............... Collection 04 — Street Stitch
│   ├── #glitch-drop ................. Collection 05 — Glitch Drop
│   ├── #society ..................... Collection 06 — Society
│   ├── #university-strip ............ University Discount Banner
│   ├── #brand-story ................. About Snippet + CTA
│   └── #newsletter .................. Email Capture
│
├── /collections/ .................... All Collections Index
│   ├── /collections/thread-classics/
│   ├── /collections/minimal-edit/
│   ├── /collections/digital-weave/
│   ├── /collections/street-stitch/
│   ├── /collections/glitch-drop/
│   └── /collections/society/
│
├── /products/ ....................... Product Detail Pages
│   └── /products/[slug]/ ............ Dynamic Product Page
│       ├── Gallery .................. Photo Carousel
│       ├── Details .................. Name / Price / Sizes
│       ├── Add to Cart .............. CTA Block
│       ├── Accordion ................ Description / Material / Shipping / Care
│       └── Related .................. You May Also Like Grid
│
├── /drops/ .......................... Limited Drop Hub
│   ├── #upcoming .................... Countdown + Notify Me
│   ├── #active ...................... Live Drop Grid
│   └── #archive ..................... Past Drops (Sold Out)
│
├── /university/ ..................... University Program Page
│   ├── #how-it-works ................ Discount Verification Flow
│   ├── #ambassadors ................. Campus Ambassador Cards
│   └── #apply ....................... Ambassador Application Form
│
├── /about/ .......................... Brand Story
│   ├── #manifesto ................... Editorial Text Block
│   ├── #founders .................... Team Section
│   ├── #sustainability .............. Fabric Sourcing Info
│   └── #press ....................... Media Mentions
│
├── /search/ ......................... Search Overlay (full-screen)
│
├── /cart/ ........................... Cart Page
│   ├── Item List
│   ├── Order Summary
│   └── Checkout CTA
│
├── /checkout/ ....................... Checkout Flow
│   ├── /checkout/delivery/ .......... Step 1 — Address
│   ├── /checkout/payment/ ........... Step 2 — Payment
│   └── /checkout/confirm/ ........... Step 3 — Review & Place Order
│
├── /account/ ........................ User Account
│   ├── /account/orders/ ............. Order History
│   ├── /account/wishlist/ ........... Saved Items
│   └── /account/settings/ ........... Profile & Preferences
│
├── /login/ .......................... Auth — Login
├── /signup/ ......................... Auth — Register
│
└── /legal/ .......................... Legal Pages
    ├── /legal/privacy/
    ├── /legal/terms/
    └── /legal/returns/
```

---

## 2. Home Page — Section-by-Section Breakdown

The home page is a long-scroll editorial experience. Each section is a self-contained unit with its own theme, logo, and typographic identity.

```
HOME  /
│
├── [SECTION 0] — GLOBAL NAVIGATION
│   │
│   ├── Left:    WOVEN wordmark (Cormorant Garamond)
│   ├── Center:  Collections · Drops · University · About
│   └── Right:   Search icon · Wishlist icon · Cart (n)
│
│   ├── Behavior: Fixed top, frosted blur backdrop
│   ├── Mobile:   Hamburger → full-screen overlay
│   └── Mega Menu on "Collections" hover (4-col grid)
│
│
├── [SECTION 1] — HERO
│   │   Full viewport height · Background: #F8F8F6
│   │
│   ├── Logo 5 (Japanese Minimal) — centered · 80px
│   ├── Headline: "Ideas Stitched Into Reality"
│   │             Cormorant Garamond · 96px · Light
│   ├── Subline:  "University Edition · SS25"
│   │             DM Mono · 13px · uppercase · tracking 4px
│   ├── CTA Row:  [Explore Collections]  [New Drop →]
│   └── Scroll indicator: animated thread line
│
│   ├── Animation: Letter-by-letter headline reveal (30ms stagger)
│   └── Detail:    Grain texture overlay · 5% opacity
│
│
├── [SECTION 2] — COLLECTIONS STRIP
│   │   Height: 56px · Sticky below nav on scroll
│   │
│   ├── Pills: Thread Classics · Minimal Edit · Digital Weave
│   │          Street Stitch · Glitch Drop · Society
│   ├── Font:  DM Mono · 11px · uppercase
│   └── Active: #111 bg · #F8F8F6 text
│
│
├── [SECTION 3] — COLLECTION 01: THREAD CLASSICS
│   │   Background: #F8F8F6 · Text: #111111
│   │   Logo: Logo 1 (Interlocked Thread)
│   │
│   ├── Header Block
│   │   ├── Section num: "01" — DM Mono · #C8A96E
│   │   ├── Logo 1 — 120px — left aligned
│   │   ├── Gold rule — full width
│   │   └── Title: "Thread Classics"
│   │             Cormorant Garamond · 72px · Italic
│   │
│   ├── Subline: "The Foundation Pieces"
│   │            DM Sans · 14px · uppercase · tracking 2px
│   │
│   ├── Product Grid — 2 columns · full width
│   │   └── Card: Photo · Name (Cormorant 22px) · Price (DM Mono)
│   │             Hover: size selector slides up
│   │
│   ├── Watermark: Logo 1 · 400px · 4% opacity · behind grid
│   └── CTA: "View Full Collection →"
│
│
├── [SECTION 4] — COLLECTION 02: MINIMAL EDIT
│   │   Background: #EFEFED · Text: #111111
│   │   Logo: Logo 5 (Japanese Minimal) + Logo 2 (Stitched Typo)
│   │
│   ├── Header Block
│   │   ├── Section num: "02" — Syne · 11px · #888
│   │   ├── Logo 5 — 64px — centered
│   │   ├── Tagline: "Less. Meant."
│   │   └── Title: "minimal edit"
│   │             Syne · 80px · ExtraBold · all-lowercase
│   │
│   ├── Thin rule — 0.5px · #111 · full width
│   │
│   ├── Product Grid — 3-col asymmetric
│   │   ├── One card spans 2 columns (hero piece)
│   │   ├── Editorial lookbook photography style
│   │   └── No card borders — whitespace only
│   │
│   └── Animation: Simultaneous fade-in · scale 1.02 on hover
│
│
├── [SECTION 5] — COLLECTION 03: DIGITAL WEAVE
│   │   Background: #1A1A1A · Text: #F8F8F6
│   │   Logo: Logo 3 (Broken Grid / Digital Weave)
│   │
│   ├── Header Block
│   │   ├── Section num: "03" — IBM Plex Mono · #00FFFF
│   │   ├── Logo 3 — 96px — top-left — white render
│   │   └── Title: "DIGITAL WEAVE"
│   │             Space Grotesk · 68px · Bold · all-caps
│   │
│   ├── Subline: IBM Plex Mono · 12px · 50% opacity
│   │
│   ├── Background detail: grid squares rgba(0,255,255,0.04)
│   ├── Scanline texture overlay
│   │
│   ├── Product Grid — 4 columns · tight
│   │   ├── Cards: #333 bg · 1px #444 border
│   │   ├── Corner brackets ⌐ ¬ in cyan
│   │   └── Hover: border → #00FFFF
│   │
│   └── Globe icon (from Logo 3) · bottom-right watermark
│
│
├── [SECTION 6] — COLLECTION 04: STREET STITCH
│   │   Background: Alternating #F8F8F6 / #111111 panels
│   │   Logo: Logo 9 (Underground Brutalist)
│   │
│   ├── Header Block
│   │   ├── Logo 9 — full-width · 200px · stamp animation
│   │   ├── Title: "STREET STITCH"
│   │   │         Bebas Neue · 120px · breaks grid intentionally
│   │   └── Subtitle: "Built Different. No two pieces alike."
│   │                  Permanent Marker · 18px
│   │
│   ├── Section decoration:
│   │   ├── Grain filter overlay
│   │   ├── Dashed border: 2px dashed #111
│   │   └── Barcode-style divider lines
│   │
│   ├── Product Grid — Masonry · irregular heights
│   │   ├── Full-bleed photos · text overlaid bottom
│   │   └── Hover: photo desaturates · text slides up
│   │
│   └── Footer tag: "EST. 2024" — DM Mono · small
│
│
├── [SECTION 7] — COLLECTION 05: GLITCH DROP
│   │   Background: #0D0D0D · Text: #F8F8F6
│   │   Logo: Logo 6 (Glitch W Logo)
│   │
│   ├── Drop Countdown — top-center
│   │   └── "DROP IN  02 : 14 : 33 : 07"
│   │        IBM Plex Mono · 32px · #00FFFF · live timer
│   │
│   ├── Header Block
│   │   ├── Logo 6 — 200px — centered — continuous CSS glitch
│   │   └── Title: "GLITCH DROP"
│   │             Rajdhani · 96px · cyan + magenta shadow split
│   │
│   ├── Subline: "Think. Create. Wear."
│   │            DM Mono · 12px · #00FFFF
│   │
│   ├── Drop Grid — 3 items
│   │   ├── Dark cards · glitch border on hover
│   │   ├── SOLD OUT stamp on past drops
│   │   └── NOTIFY ME button (magenta glow pulse) for upcoming
│   │
│   └── Corner bracket UI elements — #00FFFF
│
│
├── [SECTION 8] — COLLECTION 06: SOCIETY
│   │   Background: #D4C5B0 (warm tan) · Text: #1A1A1A
│   │   Logo: Crest / Society (heritage variant)
│   │
│   ├── Header Block
│   │   ├── Ornamental rule (top)
│   │   ├── Crest logo — 160px — centered
│   │   ├── Ornamental rule (bottom)
│   │   └── Title: "Society Collection"
│   │             Playfair Display · 72px · Bold Italic
│   │
│   ├── Subline: "Est. 2025. For Those Who Lead."
│   │            DM Mono · 12px · uppercase · tracking 5px
│   │
│   ├── Background: aged paper texture on #D4C5B0
│   ├── Double-rule borders framing section
│   │
│   ├── Product Grid — 2 columns · large studio shots
│   │   └── Hover: name underlines left-to-right · 400ms
│   │
│   └── Section footer: "WOVEN × University Societies 2025"
│                        Cormorant Garamond · Italic · small
│
│
├── [SECTION 9] — UNIVERSITY DISCOUNT BANNER
│   │   Background: #111111 · Text: #F8F8F6
│   │
│   ├── Headline: "15% Off. Always. For Students."
│   │             Cormorant Garamond · 48px
│   ├── Subline: "Verify with your university email."
│   │            DM Sans · 14px
│   └── CTA: [Verify Student Status]
│
│
├── [SECTION 10] — BRAND STORY SNIPPET
│   │   Background: #F8F8F6 · Text: #111111
│   │
│   ├── Pull quote: "We don't just make clothes.
│   │               We make the uniform of curiosity."
│   │               Cormorant Garamond · 40px · Italic
│   ├── Body paragraph: DM Sans · 16px · max-width 640px
│   └── CTA: [Read Our Story →]
│
│
└── [SECTION 11] — NEWSLETTER + FOOTER
    │   Background: #111111 · Text: #F8F8F6
    │
    ├── Newsletter
    │   ├── Headline: "Stay In The Loop"
    │   │             Cormorant Garamond · 36px · Italic
    │   ├── Email input + "Stitch In" button
    │   └── Note: "No spam. Drop alerts & early access only."
    │
    └── Footer Grid — 4 columns
        ├── Col 1: Wordmark + tagline + social icons
        ├── Col 2: Collections links
        ├── Col 3: Info links (About / University / Returns)
        ├── Col 4: Newsletter (repeated compact)
        └── Bottom bar: © 2025 Woven · All rights reserved.
```

---

## 3. Collection Detail Page — Section Breakdown

```
/collections/[collection-name]/
│
├── [NAV] — Global nav (inherits collection theme color on scroll)
│
├── [HERO] — Collection Header
│   ├── Full-width banner image (collection photography)
│   ├── Logo for this collection — overlaid center
│   ├── Collection title — collection display font
│   └── Tagline — DM Mono · uppercase
│
├── [FILTERS] — Filter & Sort Bar
│   ├── Left: Filter pills (Size · Color · Price · Type)
│   ├── Right: Sort dropdown (Newest · Price ↑↓ · Popular)
│   └── Mobile: "Filter" button → bottom drawer
│
├── [GRID] — Product Grid
│   ├── 4 col desktop · 3 col tablet · 2 col mobile
│   ├── Infinite scroll (no pagination)
│   └── Card: Photo · Name · Price · Quick-add on hover
│
└── [FOOTER] — Global footer
```

---

## 4. Product Detail Page — Section Breakdown

```
/products/[slug]/
│
├── [NAV] — Global nav
│
├── [BREADCRUMB]
│   └── Home › Collections › [Collection] › [Product Name]
│
├── [PRODUCT BODY] — 60/40 split layout
│   │
│   ├── LEFT (60%) — Gallery — Sticky
│   │   ├── Main image (3:4 ratio)
│   │   ├── Thumbnail strip (vertical)
│   │   └── Zoom on hover (desktop) · Swipe (mobile)
│   │
│   └── RIGHT (40%) — Details — Scrollable
│       ├── Collection badge (themed pill)
│       ├── Product name — collection display font · 28px
│       ├── Price — DM Mono · 20px
│       ├── Color selector — swatch circles
│       ├── Size selector — square buttons · 40px
│       │   └── "Size Guide" link → modal
│       ├── [ADD TO CART] — full width · 52px · #111 bg
│       ├── [♡ Add to Wishlist] — ghost button
│       └── Accordion sections:
│           ├── Description
│           ├── Material & Fabric
│           ├── Shipping & Returns
│           └── Care Instructions
│
├── [RELATED] — "You May Also Like"
│   ├── Headline: Cormorant Garamond · 32px
│   └── 4-item horizontal scroll strip
│
└── [FOOTER] — Global footer
```

---

## 5. Drops Hub — Section Breakdown

```
/drops/
│
├── [NAV] — Global nav
│
├── [HERO] — Drops Header
│   ├── Background: #0D0D0D
│   ├── Logo 6 (Glitch W) — glitch animation
│   └── Headline: "Limited. Always."
│               Rajdhani · 80px
│
├── [UPCOMING] — Next Drop
│   ├── Countdown timer (Days : Hrs : Min : Sec)
│   ├── Teaser image (blurred product reveal)
│   ├── Drop name — Rajdhani · 40px
│   └── [NOTIFY ME] — email capture CTA
│
├── [ACTIVE] — Current Live Drop
│   ├── "LIVE NOW" indicator (pulsing red dot)
│   └── Product grid — dark cards · live stock counter
│
├── [ARCHIVE] — Past Drops
│   ├── "SOLD OUT" stamped cards — desaturated photos
│   └── [View Archive] pagination
│
└── [FOOTER] — Global footer
```

---

## 6. University Program Page — Section Breakdown

```
/university/
│
├── [NAV] — Global nav
│
├── [HERO]
│   ├── Background: #F8F8F6
│   ├── Headline: "Dressed for Campus. Priced for Students."
│   │             Cormorant Garamond · 64px
│   └── Subline: DM Sans · 15% discount callout
│
├── [HOW IT WORKS] — 3 steps
│   ├── Step 1: Sign up with .edu or university email
│   ├── Step 2: Verification (automated check)
│   └── Step 3: Discount applied automatically at cart
│
├── [AMBASSADORS] — Campus Reps
│   ├── Photo cards (4-col grid)
│   ├── Name · University · Bio snippet
│   └── Instagram handle link
│
├── [APPLY] — Ambassador Application
│   ├── Form: Name · University · CMS/Roll number · Instagram · Why Woven?
│   └── Submit CTA
│
└── [FOOTER] — Global footer
```

---

## 7. Checkout Flow — Step Breakdown

```
/checkout/
│
├── Progress Bar (top): ── Cart ──●── Delivery ── Payment ── Confirm ──
│
├── /checkout/delivery/
│   ├── Full name
│   ├── Address line 1 & 2
│   ├── City · Province · Postal code
│   ├── Phone number
│   └── [Continue to Payment →]
│
├── /checkout/payment/
│   ├── Card details (Stripe-embedded)
│   ├── Or: EasyPaisa / JazzCash (Pakistan local)
│   ├── Billing address toggle (same as delivery)
│   └── [Review Order →]
│
└── /checkout/confirm/
    ├── Full order summary (items · quantities · prices)
    ├── Delivery address confirmation
    ├── Payment method summary
    └── [Place Order] — final CTA
        └── Success → Order confirmation page + email
```

---

## 8. Navigation Flow Diagram

```
                        ┌─────────────────────┐
                        │   GLOBAL NAV (fixed) │
                        └────────────┬────────┘
                                     │
          ┌──────────┬───────────────┼──────────────┬──────────┐
          ▼          ▼               ▼              ▼          ▼
       HOME      COLLECTIONS       DROPS       UNIVERSITY    ABOUT
          │          │               │
          │     ┌────┴─────┐    ┌───┴──────┐
          │     │ /thread  │    │ /upcoming│
          │     │ /minimal │    │ /active  │
          │     │ /digital │    │ /archive │
          │     │ /street  │    └──────────┘
          │     │ /glitch  │
          │     │ /society │
          │     └────┬─────┘
          │          │
          └──────────▼
               PRODUCT PAGE
                    │
                    ▼
                  CART
                    │
                    ▼
               CHECKOUT
          (Delivery → Payment → Confirm)
                    │
                    ▼
            ORDER CONFIRMED ✓
```

---

## 9. Component Dependency Map

```
Pages
│
├── Layout
│   ├── <GlobalNav>
│   │   ├── <Logo>
│   │   ├── <NavLinks>
│   │   ├── <MegaMenu>  ← appears on Collections hover
│   │   └── <IconBar>   ← Search · Wishlist · Cart badge
│   │
│   └── <Footer>
│       ├── <FooterLinks>
│       ├── <SocialIcons>
│       └── <NewsletterInput>
│
├── Home
│   ├── <HeroSection>
│   ├── <CollectionsStrip>
│   ├── <CollectionSection> × 6  ← each has unique theme prop
│   │   ├── <CollectionHeader>
│   │   ├── <ProductGrid>
│   │   │   └── <ProductCard>
│   │   │       ├── <ProductPhoto>
│   │   │       ├── <QuickAddOverlay>
│   │   │       └── <ProductMeta>
│   │   └── <CollectionCTA>
│   ├── <UniversityBanner>
│   ├── <BrandStorySnippet>
│   └── <NewsletterSection>
│
├── CollectionPage
│   ├── <CollectionHero>
│   ├── <FilterBar>
│   │   ├── <FilterPills>
│   │   └── <SortDropdown>
│   └── <ProductGrid> (infinite scroll)
│
├── ProductPage
│   ├── <Breadcrumb>
│   ├── <ProductGallery>
│   ├── <ProductDetails>
│   │   ├── <CollectionBadge>
│   │   ├── <SizeSelector>
│   │   ├── <ColorSelector>
│   │   ├── <AddToCartButton>
│   │   ├── <WishlistButton>
│   │   └── <ProductAccordion>
│   └── <RelatedProducts>
│
├── DropsPage
│   ├── <DropHero>
│   ├── <CountdownTimer>
│   ├── <NotifyMeForm>
│   ├── <LiveDropGrid>
│   └── <DropArchive>
│
└── Checkout
    ├── <CheckoutProgress>
    ├── <DeliveryForm>
    ├── <PaymentForm>   ← Stripe + local payment embeds
    └── <OrderConfirm>
```

---

## 10. URL Schema

```
/                               → Home
/collections/                   → All Collections Index
/collections/thread-classics/   → Collection 01
/collections/minimal-edit/      → Collection 02
/collections/digital-weave/     → Collection 03
/collections/street-stitch/     → Collection 04
/collections/glitch-drop/       → Collection 05
/collections/society/           → Collection 06
/products/[slug]/               → Product Detail (dynamic)
/drops/                         → Drops Hub
/university/                    → University Program
/about/                         → Brand Story
/search/                        → Search (overlay, no route change)
/cart/                          → Cart
/checkout/delivery/             → Checkout Step 1
/checkout/payment/              → Checkout Step 2
/checkout/confirm/              → Checkout Step 3
/account/                       → Account Dashboard
/account/orders/                → Order History
/account/wishlist/              → Saved Items
/account/settings/              → Profile Settings
/login/                         → Login
/signup/                        → Register
/legal/privacy/                 → Privacy Policy
/legal/terms/                   → Terms of Service
/legal/returns/                 → Returns Policy
```

---

## 11. Data Flow Summary

```
User Action                     →   State / API
─────────────────────────────────────────────────
Browse collection               →   GET /api/products?collection=X
Click product card              →   Navigate to /products/[slug]
Select size                     →   Local UI state
Add to cart                     →   POST /api/cart (session-based)
Apply student discount          →   POST /api/verify-student (email check)
Checkout — delivery             →   POST /api/orders/draft
Checkout — payment              →   Stripe PaymentIntent API
Order placed                    →   POST /api/orders/confirm → email trigger
Notify Me (drop)                →   POST /api/drops/notify (email list)
Newsletter signup               →   POST /api/newsletter
```

---

*WOVEN Architecture v1.0 — University Edition — SS25*
*"Ideas Stitched Into Reality"*
```