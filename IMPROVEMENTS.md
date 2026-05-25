# Woven — Full Site Audit Report
**URL:** https://woven-psi.vercel.app/  
**Date:** May 2026  
**Overall Score: 54 / 100**

> Strong brand concept and theme system. Core commerce and trust infrastructure are missing. 18 issues identified across 6 categories.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What's Working Well](#2-whats-working-well)
3. [Product Pages — Critical](#3-product-pages--critical)
4. [Trust & Credibility — Critical](#4-trust--credibility--critical)
5. [Homepage — Needs Work](#5-homepage--needs-work)
6. [Drops Page — Needs Work](#6-drops-page--needs-work)
7. [Cart & Checkout — Needs Work](#7-cart--checkout--needs-work)
8. [SEO & Technical — Minor](#8-seo--technical--minor)
9. [Priority Fix Roadmap](#9-priority-fix-roadmap)
10. [Detailed Implementation Instructions](#10-detailed-implementation-instructions)

---

## 1. Executive Summary

Woven has a genuinely differentiated concept — a theme-led clothing system (Classic / Summer / Winter) with strong copywriting and clean minimal design. The brand positioning is clear and the visual language is appropriate for the target market.

However, the site is missing the foundational elements that turn visitors into paying customers: real product photography, a size guide, trust signals, contact information, and social proof. A shopper landing on this site for the first time has no way to verify the brand is legitimate, no way to contact anyone with questions, and no size guidance to feel confident placing an order.

The fixes are all achievable. None require a redesign — they are additive improvements to an already solid foundation.

---

## 2. What's Working Well

| Strength | Why It Matters |
|---|---|
| **Theme system (Classic / Summer / Winter)** | Genuinely differentiating concept. Most clothing brands don't organise this way. Creates strong repeat-visit reasons as seasons change. |
| **Clean minimalist design language** | Typography, spacing, and colour palette feel refined and appropriate for the brand's positioning. |
| **Product copywriting quality** | Lines like *"Polished layers for dinners, meetings, events, and the days that ask for more"* are well-written, brand-consistent, and evocative. |
| **Breadcrumb navigation** | Product pages correctly show Classic → Plain Essentials → Clean Crew Tee. Good for UX and SEO. |
| **Product codes (PE-01, FE-02, RB-01)** | A subtle brand touch that adds perceived organisation and suggests a professional, curated catalogue. |
| **Tagline — "Ideas Stitched Into Reality"** | Memorable and on-brand. Works well at the hero level. |

---

## 3. Product Pages — Critical

These issues are directly responsible for lost sales. Product pages are where purchase decisions are made.

---

### 3.1 No Product Image Gallery

**Severity:** Critical  
**Page affected:** All product pages (e.g. `/products/clean-crew-tee`)

**Problem:**  
Each product shows a single image. Fashion shoppers need to see a product from multiple angles before committing to a purchase. A single image raises doubt about quality, fit, and finish.

**What's missing:**
- Front view
- Back view
- Detail / close-up shot (stitching, fabric texture, label)
- Flat lay
- At least one on-model lifestyle shot showing fit and scale

**Fix:**  
Add an image carousel or side-by-side image grid with 4–6 photos per product. Include a zoom-on-hover or tap-to-zoom feature for desktop and mobile. The main image should update when a colour swatch is selected (see 3.3).

---

### 3.2 No Size Guide

**Severity:** Critical  
**Page affected:** All product pages

**Problem:**  
Sizes XS–XL are displayed but there is no size guide, no body measurements, and no fit descriptor (slim fit / regular fit / oversized). This is the single most common reason shoppers abandon a clothing purchase. They cannot risk ordering the wrong size from a brand they haven't bought from before.

**Fix:**  
Add a "Size Guide" text link directly beside or below the size selector. Clicking it opens a modal (no page navigation) showing a table like this:

| Size | Chest (inches) | Waist (inches) | Length (inches) |
|---|---|---|---|
| XS | 34–36 | 28–30 | 27 |
| S | 36–38 | 30–32 | 28 |
| M | 38–40 | 32–34 | 29 |
| L | 40–42 | 34–36 | 30 |
| XL | 42–44 | 36–38 | 31 |

Also add a one-line fit descriptor under the product name, e.g. *"Straight fit — true to size"* or *"Relaxed fit — size down for a slimmer look."*

---

### 3.3 No Colour Variants

**Severity:** High  
**Page affected:** All product pages

**Problem:**  
No colour swatches are shown. It's unclear whether each product comes in one colour or multiple. Even if products currently only come in one colour, the absence of any colour indicator makes the page feel incomplete and limits future flexibility.

**Fix:**  
Add circular or square colour swatches (20–24px) below the product name. Each swatch should:
- Show the colour of the variant
- Be visually selected/active for the current colour
- Update the main product image on click
- Show the colour name on hover (e.g. "Slate Grey", "Bone White")

---

### 3.4 No Customer Reviews or Social Proof

**Severity:** High  
**Page affected:** All product pages, homepage

**Problem:**  
There are no customer reviews, star ratings, or testimonials anywhere on the site. For a brand with no offline presence, reviews are the primary way new customers decide to trust you. Without them, every visitor is buying blind.

**Fix:**  
Add a reviews section at the bottom of every product page with:
- Average star rating displayed near the product title (e.g. ★★★★☆ 4.3 — 12 reviews)
- Individual review cards showing: star rating, reviewer name (first name + initial), date, and review text
- A "Write a Review" button for verified purchasers

At launch, seed the site with 3–5 genuine reviews from friends, family, or early customers. Even a small number signals the brand is real and trusted.

---

### 3.5 Shipping & Returns Information Buried

**Severity:** Medium  
**Page affected:** All product pages

**Problem:**  
Shipping and returns information is placed inside a collapsed accordion near the bottom of the product page. Most shoppers will not scroll down to find it. This information — especially the returns policy — is a key factor in the decision to add to cart.

**Current copy:** *"Ships in 3 to 5 working days. Returns accepted within 14 days if unworn."*

**Fix:**  
Add three icon badges directly below the Add to Cart button, before the accordion:

- 🚚 **Ships in 3–5 days** — Nationwide delivery
- 🔄 **14-day returns** — Unworn items only
- 🔒 **Secure checkout** — Your data is safe

These should be small, inline, and unobtrusive — not large banners. They provide reassurance without disrupting the purchase flow.

---

### 3.6 No Stock or Urgency Signals

**Severity:** Medium  
**Page affected:** Product pages, Drops page

**Problem:**  
There is no indication of stock levels. For a brand running "limited drops," this is a missed conversion lever. Scarcity, when real, is a valid and effective purchase motivator.

**Fix:**  
- On the Drops page: show "Only 4 left" or "Low stock" for items with fewer than 5 units
- On size selectors: grey out / cross out sizes that are out of stock
- On sold-out products: replace "Add to Cart" with "Notify Me When Back" (requires email capture)

---

## 4. Trust & Credibility — Critical

These issues affect whether a first-time visitor believes Woven is a real, trustworthy business.

---

### 4.1 No Contact Information

**Severity:** Critical  
**Page affected:** Entire site

**Problem:**  
There is no email address, WhatsApp number, phone number, or contact form anywhere on the site — not in the footer, not in the About page, not in a dedicated Contact page. This is the most significant trust gap on the site.

In Pakistan, online shoppers frequently want to verify a brand is reachable before placing an order. No contact info reads as: *no one to call if something goes wrong.*

**Fix:**  
Add to the footer:
- Email address (e.g. hello@woven.pk)
- WhatsApp number with a "Chat with us" link (`https://wa.me/923XXXXXXXXX`)
- Response time expectation: "We reply within 24 hours"

Also create a `/contact` page linked from the footer and About page.

---

### 4.2 No Real About Page

**Severity:** Critical  
**Page affected:** `/about`

**Problem:**  
The About page currently contains only three generic how-it-works steps:
1. Choose a theme
2. Find your pieces
3. Wear your way

There is no brand story, no founder information, no founding year, no explanation of why Woven exists, and no values statement. This page does nothing to build connection or trust with a first-time visitor.

**Fix:**  
Rewrite the About page with:

**Brand Story (200–300 words):** When was Woven founded? By whom? What problem were they trying to solve? What makes Woven different from other Pakistani clothing brands? What does "Ideas Stitched Into Reality" actually mean to the people behind it?

**Brand Values (3–4 points):** e.g. Quality over quantity / Slow fashion / Made for real life / Thoughtful design

**The Team (optional but powerful):** Even a single photo of the founder with a short quote adds enormous credibility.

**A closing CTA:** Link to Collections or the latest drop.

---

### 4.3 No Social Media Links

**Severity:** Critical  
**Page affected:** Footer, homepage

**Problem:**  
There are no Instagram, TikTok, Facebook, or any other social media links anywhere on the site. For a clothing brand, social media is the primary trust signal, discovery channel, and community builder — especially for a Pakistani audience where Instagram and TikTok drive the majority of fashion discovery.

**Fix:**  
- Add Instagram, TikTok, and Facebook icon links to the footer
- Consider adding an Instagram feed grid section on the homepage (6–9 most recent posts) — this shows real product content, real lifestyle shots, and real community activity at a glance
- Add social icons to the email newsletter footer

---

### 4.4 No Trust Badges or Payment Method Logos

**Severity:** High  
**Page affected:** Cart (`/cart`), Checkout

**Problem:**  
The cart and checkout pages show no payment method logos, no security badge, and no "secure checkout" language. Customers are being asked to complete a financial transaction with zero visual reassurance.

**Fix:**  
On the cart page, below the "Continue" button, add:
- A row of payment logos: Easypaisa, JazzCash, Visa, Mastercard
- A small SSL/secure lock icon with the text "Secure & encrypted checkout"

---

## 5. Homepage — Needs Work

---

### 5.1 Hero Section Has No Visual Image

**Severity:** Critical  
**Page affected:** Homepage (`/`)

**Problem:**  
The hero section is text-only: *"Plain, formal, and refined pieces for everyday life."* A clothing brand's homepage hero is its single most important piece of real estate. A text-only hero fails to communicate the brand's aesthetic, quality, or mood — the things that make someone want to buy.

**Fix:**  
Replace the text hero with a full-width editorial photograph:
- Minimum resolution: 1600 × 900px
- Subject: a model or flat lay showing the brand's hero product in a lifestyle setting
- Overlay the headline and CTA ("Explore Collections") on top using a subtle dark-to-transparent gradient for text readability
- On mobile, ensure the image crops gracefully (subject not cut off)

If photography is not yet available, a well-composed flat lay or product-on-surface image is far better than no image at all.

---

### 5.2 Newsletter Signup Has No Value Proposition

**Severity:** Medium  
**Page affected:** Footer (all pages)

**Problem:**  
The footer shows "Stay In The Loop" and a "Join" button, but no email input field is visible in the page source, and there is no incentive for signing up. This will convert at near-zero.

**Fix:**  
Replace with a proper email signup component:
- Visible email input field + submit button
- A clear incentive: *"Get 10% off your first order"* or *"Be the first to know about new drops and exclusive pieces"*
- Confirmation message after submission: *"You're in. Watch your inbox."*

---

### 5.3 No "New In" or Featured Product Section

**Severity:** Medium  
**Page affected:** Homepage

**Problem:**  
The homepage moves directly from the hero text into collection browsing. There is no curated "New In" moment, no editorial feature, and no hero product that represents the brand's current focus. Every page feels equally weighted.

**Fix:**  
Add a "New Arrivals" or "Just Dropped" horizontal scroll strip above the collection sections, featuring 4–6 products tagged as new (PE-01, FE-01, RB-01 already have "New" badges — surface them here). Include:
- Product image (square crop)
- Product name
- Price
- Quick Add to Cart

---

## 6. Drops Page — Needs Work

---

### 6.1 Drops Page Is Indistinguishable From Regular Collections

**Severity:** Critical  
**Page affected:** `/drops`

**Problem:**  
The Drops page headline says *"Limited. Always."* — but the page shows the exact same product grid cards as every other collection page. There are no countdown timers, no drop dates, no stock counters, no "notify me" buttons, and no visual difference from browsing /collections. The site's own meta description describes "live countdowns and notify-me states" — none of which exist.

This is a significant missed opportunity. A Drops page, done well, creates urgency, rewards loyal customers, and drives repeat visits. Done like this, it's just another product listing.

**Fix:**  
Rebuild the Drops page experience:

**For upcoming drops (not yet live):**
- Large product image with a countdown timer overlay (Days / Hours / Minutes / Seconds)
- "Drop date: Saturday 31 May, 12:00 PM" clearly labelled
- A "Notify Me" button that captures email and sends a reminder 1 hour before the drop

**For live drops:**
- "Live Now" badge on the product card
- Stock counter: "Only 6 remaining"
- A sense of visual urgency — different card style, accent colour treatment

**For past drops (sold out):**
- "Sold Out" state with a greyed-out card
- "Join the waitlist" CTA for potential restock

---

## 7. Cart & Checkout — Needs Work

---

### 7.1 No Promo / Discount Code Field

**Severity:** Medium  
**Page affected:** `/cart`

**Problem:**  
There is no field to enter a promotional or discount code in the cart. This is a standard e-commerce feature that shoppers expect, and it's required to run any promotional campaigns, influencer codes, or first-order discounts.

**Fix:**  
Add a collapsible "Have a promo code?" section inside the Order Summary area. On click, it expands to show a text input and "Apply" button. A successful code shows the discount amount deducted from the subtotal.

---

### 7.2 No Delivery Cost Shown Before Checkout

**Severity:** High  
**Page affected:** `/cart`

**Problem:**  
The cart shows only a subtotal (PKR 16,000 in the example). Delivery cost is not revealed until the next checkout step. Surprise costs are the number one cause of cart abandonment globally.

**Fix:**  
Show estimated shipping in the cart summary, e.g.:
- *"Standard delivery — PKR 200"*
- Or ideally: *"Free delivery on orders over PKR 5,000 ✓"* (this also increases average order value)

If delivery cost varies by location, show: *"Shipping calculated at checkout"* — at minimum, the shopper knows to expect it.

---

### 7.3 No Quantity Editing in Cart

**Severity:** Medium  
**Page affected:** `/cart`

**Problem:**  
Cart line items show "Quantity 1" as static text. There are no +/− controls to increase quantity, and no remove button visible. Shoppers who want to buy 2 of something, or who added the wrong item, have no clear way to correct their cart.

**Fix:**  
Add to each cart line item:
- A −/+ quantity control (inline, small)
- A remove/delete link or × icon
- The line total updating dynamically as quantity changes (e.g. 2 × PKR 3,200 = PKR 6,400)

---

## 8. SEO & Technical — Minor

---

### 8.1 Missing Open Graph Images

**Severity:** Low  
**Page affected:** All pages

The `og:image` meta tag is absent. When a link to Woven is shared on WhatsApp, Instagram Stories, or Twitter/X, it will appear as a plain text link with no image preview. For a visual product brand, this is a missed impression.

**Fix:** Add a default `og:image` pointing to a high-quality brand image (1200 × 630px). Override it per product with the product's hero image.

---

### 8.2 Twitter Card Type Should Be "summary_large_image"

**Severity:** Low  
**Page affected:** All pages

The current `twitter:card` is set to `summary` (small square thumbnail). For a clothing brand, `summary_large_image` shows a large banner image when links are shared — much more impactful for visual products.

**Fix:** Change `<meta name="twitter:card" content="summary">` to `content="summary_large_image"` and add `twitter:image`.

---

### 8.3 No Favicon

**Severity:** Low  
**Page affected:** All pages

A favicon (the small icon shown in browser tabs and bookmarks) does not appear to be set. This is a small but visible polish gap.

**Fix:** Create a simple favicon using the Woven "W" mark or a small version of the logo. Export at 32×32px and 180×180px (for Apple touch icon).

---

## 9. Priority Fix Roadmap

### Week 1 — Do First (Highest Impact, Lowest Effort)

These fixes are either content changes or simple additions that don't require rebuilding any pages.

| # | Fix | Why Now |
|---|---|---|
| 1 | Add a hero image to the homepage | Single biggest visual improvement |
| 2 | Add contact info to the footer | Removes the #1 trust barrier |
| 3 | Rewrite the About page with a real brand story | Converts curious visitors to believers |
| 4 | Add social media links (Instagram, TikTok) | Establishes brand legitimacy |
| 5 | Add a size guide modal to product pages | Removes the #1 reason for purchase hesitation |

---

### Week 2–3 — Do Next (High Impact, Moderate Effort)

| # | Fix | Why |
|---|---|---|
| 6 | Add product image gallery (4–6 images per product) | Fashion brands live and die by photography |
| 7 | Add colour swatches to product pages | Increases perceived product range and value |
| 8 | Add shipping/returns badges below Add to Cart | Reduces friction at point of decision |
| 9 | Add quantity controls and remove button to cart | Basic e-commerce functionality |
| 10 | Add delivery cost or free shipping threshold to cart | Eliminates surprise costs at checkout |
| 11 | Build out the Drops page with countdowns and scarcity | The concept is great — the execution needs to match |
| 12 | Update newsletter signup with email input + incentive | Current state converts near zero |

---

### Month 2 — Polish & Growth

| # | Fix | Why |
|---|---|---|
| 13 | Add customer reviews to product pages | Social proof compounds over time — start collecting now |
| 14 | Add stock indicators and low-stock warnings | Real scarcity signals on Drops page |
| 15 | Add payment logos and security badge to checkout | Reduces payment drop-off |
| 16 | Add promo/discount code field to cart | Required for running any promotions |
| 17 | Fix Open Graph images for social sharing | Every shared link becomes a brand impression |
| 18 | Add Instagram feed grid to homepage | Bridges social and web, shows real product content |

---

## 10. Detailed Implementation Instructions

### How to write the About page

The About page should answer four questions:

1. **Who?** — Who started Woven, and when?
2. **Why?** — What gap in the market did they see? What wasn't being done well by other Pakistani clothing brands?
3. **How?** — How does Woven approach design differently? What does the theme system mean in practice?
4. **What next?** — Where is the brand going? What can customers expect?

**Suggested structure:**

```
[Full-width brand image — lifestyle or studio]

Heading: "Clothing made for the way you actually live."

Body paragraph (150–200 words): Brand story

---

Three value columns:
  [Icon] Considered design
  [Icon] Built to last
  [Icon] Made for real days

---

Optional: Founder photo + short quote

CTA: "Explore the latest collection →"
```

---

### How to structure the Drops page

Each drop card should show:

```
[Product Image]
[Drop badge: "Live Now" / "Drops Saturday" / "Sold Out"]
[Countdown timer — if upcoming]
[Product name]
[Price]
[Stock level — "Only 3 left"]
[CTA: "Add to Bag" / "Notify Me" / "Sold Out"]
```

The page header should include a brief explanation: *"Woven drops are limited runs. Once they're gone, they're gone. Sign up to be notified before each drop."*

---

### How to set up the newsletter properly

Current state: "Stay In The Loop" + "Join" button (no input visible).

Correct implementation:

```
Heading: "Be first. Always."
Subheading: "New drops, restocks, and exclusive pieces. Straight to your inbox."
Input: [your@email.com        ] [Join Woven →]
Fine print: "No spam. Unsubscribe anytime."
```

Consider offering: *"Sign up and get 10% off your first order"* — this directly incentivises signup and first purchase in one action.

---

### Photography brief (if shoots haven't happened yet)

For each product you need at minimum:

| Shot type | Description |
|---|---|
| Front flat lay | Product laid flat on a clean surface, natural light |
| Back flat lay | Same, reverse side |
| Detail close-up | Fabric texture, stitching, label, buttons |
| On-model front | Model wearing the piece, neutral background |
| On-model lifestyle | Model in context (café, street, home) |

Shoot on a consistent background (white, off-white, or concrete). Use natural daylight or a softbox. Consistency across all products matters more than any single hero shot.

---

*End of audit. Total issues: 18 across 6 categories. Estimated time to resolve Week 1 items: 2–4 days of focused work.*