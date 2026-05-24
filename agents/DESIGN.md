# WOVEN — Design System & Website Blueprint
### *Ideas Stitched Into Reality*

---

## 1. Brand Overview

**Brand Name:** Woven  
**Tagline:** Ideas Stitched Into Reality  
**Target Audience:** University Students (18–24)  
**Brand Personality:** Creative, Expressive, Culturally-aware, Bold but Refined  
**Core Brand Promise:** Clothing that speaks to student identity — minimalist meets streetwise meets academic tradition.

---

## 2. Color System

### Global Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#F8F8F6` | All page backgrounds |
| `--color-surface` | `#EFEFED` | Cards, panels, elevated surfaces |
| `--color-surface-dark` | `#1A1A1A` | Dark section backgrounds |
| `--color-text-primary` | `#111111` | All primary text on light |
| `--color-text-secondary` | `#555555` | Subtext, captions, metadata |
| `--color-text-inverse` | `#F8F8F6` | Text on dark backgrounds |
| `--color-accent` | `#C8A96E` | Gold accent — hover states, underlines, dividers |
| `--color-accent-dark` | `#8B6E3A` | Deeper gold for dark sections |
| `--color-border` | `rgba(17,17,17,0.12)` | Subtle borders and dividers |
| `--color-glitch-cyan` | `#00FFFF` | Glitch/digital section accent |
| `--color-glitch-magenta` | `#FF00FF` | Glitch/digital section accent |

### Section Background Switching Rule
- **Light sections** (default): `#F8F8F6` bg, `#111111` text
- **Dark sections** (feature/highlight): `#1A1A1A` bg, `#F8F8F6` text
- **Tan/neutral sections** (heritage/tradition): `#D4C5B0` bg, `#111111` text

> **HCI Principle (Contrast):** All text/background pairings must meet WCAG AA (4.5:1 minimum). The off-white `#F8F8F6` instead of pure white reduces eye strain for prolonged browsing — a key consideration for student users.

---

## 3. Typography System

Woven uses **multiple font personalities** — each mapped to a clothing collection theme. Fonts are loaded via Google Fonts.

### Global Type Tokens

| Token | Font | Weight | Usage |
|---|---|---|---|
| `--font-nav` | `Cormorant Garamond` | 500 | Navigation, global brand name |
| `--font-body` | `DM Sans` | 400/500 | Body text, descriptions, UI labels |
| `--font-caption` | `DM Mono` | 400 | Price labels, tags, metadata |

### Collection-Specific Typography (detailed in Section 7)

| Collection | Display Font | Style |
|---|---|---|
| Thread Classics | `Cormorant Garamond` | Serif elegance |
| Minimal Edit | `Syne` | Modern geometric |
| Digital Weave | `Space Grotesk` + `IBM Plex Mono` | Technical |
| Street Stitch | `Bebas Neue` + `Permanent Marker` | Raw/brutalist |
| Glitch Drop | `Rajdhani` | Distorted digital |
| Society Collection | `Playfair Display` | Heritage crest |

---

## 4. Logo Assignment by Collection

Based on the two reference sheets, specific logos are assigned to specific clothing collections.

### From Image 1 (Flat/Graphic logos):
- **Logo 1 — Interlocked Thread Logo** → Thread Classics collection
- **Logo 2 — Stitched Typography** → Minimal Edit / Japanese collection
- **Logo 5 — Japanese Minimal Style** → Minimal Edit collection
- **Logo 9 — Underground Brutalist** → Street Stitch collection

### From Image 2 (Photorealistic/Textured logos):
- **Logo 3 — Broken Grid / Digital Weave** → Digital Weave collection
- **Logo 5 — Japanese Minimal Style** → Minimal Edit collection (shared)
- **Logo 6 — Glitch W Logo** → Glitch Drop collection
- **Logo 9 — Underground Brutalist** → Street Stitch collection (shared)

> **Design Principle:** The logo visually signals which "world" the user is entering. Consistent logo-to-collection mapping builds brand recognition and wayfinding.

---

## 5. Global Layout Principles

### Grid System
- **Desktop:** 12-column grid, 80px outer margin, 24px gutter
- **Tablet:** 8-column grid, 40px margin, 16px gutter
- **Mobile:** 4-column grid, 20px margin, 12px gutter

### Spacing Scale (8px base)
```
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 96px / 128px / 192px
```

### Border Radius
- Cards: `4px` (intentionally minimal — anti-bubbly)
- Buttons: `2px` (sharp, editorial)
- Badges/Tags: `0px` (fully squared — raw feel)

---

## 6. HCI Principles Applied

### Visibility & Feedback
- All interactive elements have clear hover/active states with 200ms transitions
- Add-to-cart triggers a slide-up toast: "Added to cart ✓"
- Size selection highlights with a 2px `#111111` border
- Wishlist heart animates with a scale pulse on click

### Consistency
- Navigation stays fixed with a frosted-glass blur backdrop
- Section numbering (`01`, `02`…) appears throughout for orientation
- All CTAs use the same button component — never arbitrary link styles

### Recognition over Recall
- Persistent mini-cart icon with item count badge
- Breadcrumb trail on product pages
- Collection pills remain visible while scrolling product grids

### Error Prevention
- Size chart modal accessible before add-to-cart
- "Notify Me" replaces add-to-cart for out-of-stock items
- Order confirmation requires a review step before final submit

### Aesthetic-Usability Effect
- Beautiful design increases perceived usability for student audience
- Textured backgrounds, micro-animations, and careful typography all reduce cognitive friction

### Fitts's Law
- CTAs are large (min 48px height), placed in high-attention zones
- Mobile bottom bar keeps primary actions thumb-reachable

### Progressive Disclosure
- Product cards show minimal info; hover/tap reveals size options + quick-add
- Filter panel collapses by default on mobile

---

## 7. Page Architecture

---

### 7.1 — Global Navigation

**Position:** Fixed top, full-width  
**Height:** 72px desktop / 60px mobile  
**Background:** `#F8F8F6` with `backdrop-filter: blur(12px)` + `0.92` opacity  
**Border:** 1px solid `rgba(17,17,17,0.08)` bottom

**Layout:**
```
[WOVEN wordmark — left]    [Collections  Drops  About  University]    [Search  Wishlist  Cart(n)]
```

**Font:** `Cormorant Garamond` 500 16px for wordmark, `DM Sans` 400 13px for nav links  
**Active state:** Gold underline `#C8A96E`, 1.5px, slides in from left  
**Mobile:** Hamburger → full-screen overlay with staggered link reveal animation

**Mega Menu (on Collections hover):**
- 4-column grid with collection names, mini logo, and one hero image per collection
- Each column uses the collection's display font for its title

---

### 7.2 — Hero Section

**Theme:** Minimal / Editorial  
**Background:** `#F8F8F6`  
**Logo used:** Logo 5 (Japanese Minimal) — centered above headline

**Layout:**
```
[Full viewport height]
[Logo 5 — small, centered, 80px wide]
[Headline — "Ideas Stitched Into Reality"]
[Subline — "University Edition · SS25"]
[Two CTAs: "Explore Collections" | "New Drop"]
[Scroll indicator — animated thread unraveling downward]
```

**Typography:**
- Headline: `Cormorant Garamond` 96px / Light 300 / letter-spacing: -1px
- Subline: `DM Mono` 13px / uppercase / letter-spacing: 4px
- CTAs: `DM Sans` 500 14px / uppercase

**Animation:**
- On load: headline fades in letter-by-letter (staggered 30ms per character)
- Scroll indicator: thin vertical line that extends downward with a looping pulse
- Subtle paper texture overlay on background (5% opacity grain)

**HCI Note:** Single focal point, high contrast headline, two-choice CTA prevents decision paralysis.

---

### 7.3 — Collections Strip (Navigation Aid)

**Position:** Immediately below hero  
**Height:** 56px  
**Style:** Horizontal scrollable pill row on mobile; full-width flex on desktop

**Pills:**
```
[Thread Classics]  [Minimal Edit]  [Digital Weave]  [Street Stitch]  [Glitch Drop]  [Society]
```

**Active pill:** `#111111` bg, `#F8F8F6` text  
**Inactive:** transparent bg, `#111111` text, 1px border  
**Font:** `DM Mono` 11px uppercase

**HCI Note:** Persistent category navigation reduces depth of navigation hierarchy. Students can jump directly to their aesthetic.

---

## 8. Collection Sections (Detailed)

Each collection section is a full-page horizontal or vertical scroll unit. They alternate light/dark backgrounds and each has a fully unique typographic personality.

---

### Collection 01 — Thread Classics

**Logo:** Logo 1 (Interlocked Thread — Image 1)  
**Aesthetic:** Refined, heritage, premium basics  
**Audience fit:** Students who want wardrobe essentials with quality signals  
**Tagline:** "The Foundation Pieces"

**Background:** `#F8F8F6` (light)  
**Text:** `#111111`  
**Accent:** `#C8A96E` gold underlines and dividers

**Typography:**
- Section number: `DM Mono` 11px / `#C8A96E`
- Collection title: `Cormorant Garamond` 72px / Italic 400
- Subtitle: `DM Sans` 14px / 400 / letter-spacing: 2px / uppercase
- Product names: `Cormorant Garamond` 22px / 500
- Prices: `DM Mono` 14px

**Layout:**
```
[Section number "01" — small top-left]
[Logo 1 — 120px — left-aligned]
[Large serif headline — right side, asymmetric]
[2-column product grid below — full width]
[Each card: product photo top, name + price bottom, hover reveals size selector]
```

**Decorative Detail:**
- Thin horizontal rule in `#C8A96E` between logo and headline
- Logo 1 rendered as a large 400px watermark in `rgba(17,17,17,0.04)` behind the grid

**Animation:**
- Cards stagger in on scroll (translateY 40px → 0, opacity 0 → 1, 60ms stagger)
- Gold underline on product name sweeps in on hover

---

### Collection 02 — Minimal Edit

**Logo:** Logo 2 (Stitched Typography) + Logo 5 (Japanese Minimal)  
**Logo usage:** Logo 5 used as section mark; Logo 2 used in the product hang-tag detail  
**Aesthetic:** Japanese-inspired minimalism, muted tones, considered cuts  
**Audience fit:** Design and architecture students; aesthetic-forward campus dressers  
**Tagline:** "Less. Meant."

**Background:** `#EFEFED` (soft surface)  
**Text:** `#111111`  
**Accent:** Thin 1px rules, generous whitespace

**Typography:**
- Section number: `Syne` 11px / uppercase / `#888888`
- Collection title: `Syne` 80px / ExtraBold 800 / all-lowercase
- Subtitle: `Syne` 13px / 400 / letter-spacing: 6px / uppercase
- Product names: `Syne` 16px / 500
- Prices: `DM Mono` 13px / `#888888`

**Layout:**
```
[Extreme whitespace — 160px top padding]
[Logo 5 — centered — 64px]
[One-line tagline beneath: "Less. Meant."]
[3-column asymmetric grid — one card spans 2 columns]
[No borders on cards — pure whitespace separation]
[Products presented as editorial lookbook stills, not product shots]
```

**Decorative Detail:**
- Single thin horizontal line `#111111` 0.5px spanning full width between title and grid
- No shadows — depth achieved through spacing alone

**Animation:**
- On scroll: cards fade in at 0 stagger — simultaneous reveal for unified feel
- Hover: photo subtly shifts scale 1.02, no other change

**HCI Note:** Minimal cognitive load. Fewer visual elements = more focus on the clothing itself, matching the collection's philosophy.

---

### Collection 03 — Digital Weave

**Logo:** Logo 3 (Broken Grid / Digital Weave — Image 2)  
**Aesthetic:** Tech-coded, pixelated references, algorithmic patterns  
**Audience fit:** CS and engineering students; tech-culture-aware dressers  
**Tagline:** "Generated. Designed. Worn."

**Background:** `#1A1A1A` (dark)  
**Text:** `#F8F8F6`  
**Accent:** `#C8A96E` + subtle `#00FFFF` for grid/digital details

**Typography:**
- Section number: `IBM Plex Mono` 10px / `#00FFFF` / uppercase
- Collection title: `Space Grotesk` 68px / Bold 700 / all-caps
- Subtitle: `IBM Plex Mono` 12px / letter-spacing: 4px / `rgba(248,248,246,0.5)`
- Product names: `Space Grotesk` 16px / 500
- Prices: `IBM Plex Mono` 14px / `#C8A96E`

**Layout:**
```
[Dark section — full viewport]
[Logo 3 (Broken Grid) — 96px — top left — rendered in white]
[Section number in cyan — top right]
[Headline splits across two lines with a pixel-break animation]
[4-column tight grid with `#333` card backgrounds]
[Cards have 1px `#444` border — dark UI card style]
[Globe icon from Logo 3 repeated as a small watermark in bottom-right of section]
```

**Decorative Detail:**
- Scanline texture overlay on background (subtle 2px horizontal lines, 4% opacity)
- Grid pattern behind headline: `rgba(0,255,255,0.04)` squares matching Logo 3 motif
- Product card corner brackets `⌐ ¬` in cyan (ASCII-art inspired)

**Animation:**
- Headline assembles character-by-character like a terminal
- Cards load with a brief static/glitch effect (opacity flicker 3 frames)
- Hover: card border flicks to `#00FFFF` 200ms

**HCI Note:** Dark mode reduces eye strain during nighttime browsing (common for students). Cyan accent draws eye to interaction points against dark bg.

---

### Collection 04 — Street Stitch

**Logo:** Logo 9 (Underground Brutalist — both Image 1 and Image 2)  
**Aesthetic:** Raw, underground, streetwear energy  
**Audience fit:** Arts, music, social science students; streetwear culture participants  
**Tagline:** "Built Different."

**Background:** Alternating `#F8F8F6` and `#111111` panels in the same section  
**Text:** Depends on panel bg  
**Accent:** Raw brushstroke underlines, no refined gold

**Typography:**
- Section number: `DM Mono` 10px / uppercase / `#888`
- Collection title: `Bebas Neue` 120px / all-caps / tracking: -2px
- Subtitle: `Permanent Marker` 18px (handwritten feel)
- Product names: `Bebas Neue` 24px
- Prices: `DM Mono` 13px

**Layout:**
```
[Logo 9 (Brutalist) — full-width hero treatment — 200px tall — grainy texture applied]
[Headline "STREET STITCH" in massive Bebas Neue — breaks the grid intentionally]
[Subtitle in Permanent Marker below — "Built Different. No two pieces alike."]
[Masonry grid — irregular card heights — editorial chaos controlled]
[Each card: full-bleed photo with text overlaid at bottom — no white space around photo]
```

**Decorative Detail:**
- Grain filter: `filter: url(#grain)` SVG noise overlay on entire section
- Dashed border around section: `border: 2px dashed #111`
- Barcode-style thin lines used as decorative dividers
- "EST. 2024" tag in small `DM Mono` at section footer

**Animation:**
- Logo 9 renders with a brief stamping animation (scale 1.3 → 1.0, opacity 0 → 1, 400ms ease-out)
- Cards enter with a skewed translateX + opacity reveal
- Hover: card photo de-saturates slightly; white text overlay slides up

**HCI Note:** Intentional visual tension matches brand identity; students reading this section immediately understand the subculture reference.

---

### Collection 05 — Glitch Drop

**Logo:** Logo 6 (Glitch W Logo — Image 2)  
**Aesthetic:** Digital distortion, limited drops, hype culture  
**Audience fit:** Students who follow limited drops, NFT/digital culture adjacents  
**Tagline:** "Think. Create. Wear."

**Background:** `#0D0D0D` (near-black)  
**Text:** `#F8F8F6`  
**Accent:** `#00FFFF` (cyan), `#FF00FF` (magenta) — full RGB glitch palette

**Typography:**
- Section number: `Rajdhani` 11px / Bold / `#FF00FF`
- Collection title: `Rajdhani` 96px / Bold 700 — rendered with CSS text-shadow glitch
- Subtitle: `DM Mono` 12px / `#00FFFF`
- Product names: `Rajdhani` 20px / 600
- Prices: `DM Mono` 14px / `#FF00FF`
- Drop timer: `IBM Plex Mono` 32px / tabular-nums / `#00FFFF`

**CSS Glitch Effect for Title:**
```css
.glitch-title {
  position: relative;
  color: #F8F8F6;
}
.glitch-title::before {
  content: attr(data-text);
  position: absolute;
  left: -2px;
  color: #00FFFF;
  clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
  animation: glitch-shift 2s infinite;
}
.glitch-title::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  color: #FF00FF;
  clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
  animation: glitch-shift 2s infinite 0.1s;
}
```

**Layout:**
```
[Full-black section]
[Countdown timer top-center: "DROP IN 02:14:33:07" — Days:Hrs:Min:Sec]
[Logo 6 (Glitch W) — 200px — center — full glitch CSS applied]
[Glitch headline below]
[3 featured drop items in dark cards — "SOLD OUT" stamp on past drops]
[Notify Me CTA prominent for upcoming items]
[Corner bracket UI elements — inspired by Image 2 Logo 6 frame detail]
```

**Animation:**
- Logo 6 continuously glitches (CSS keyframes, random clip-path slices)
- Countdown timer ticks in real-time
- Cards scan in with a horizontal sweep animation
- "NOTIFY ME" button pulses with a faint magenta glow

**HCI Note:** Countdown creates urgency (scarcity principle). Notify Me CTA prevents user frustration with unavailable items — turns a dead-end into an engagement opportunity.

---

### Collection 06 — Society Collection

**Logo:** (Heritage/Crest variant — referenced from Logo 7 aesthetic, Crest / Society)  
**Aesthetic:** Academic heritage, club culture, blazers and collegiate pieces  
**Audience fit:** Students involved in societies, MUNs, debate clubs, student unions  
**Tagline:** "Est. 2025. For Those Who Lead."

**Background:** `#D4C5B0` (warm tan — heritage feel)  
**Text:** `#1A1A1A`  
**Accent:** `#8B6E3A` (dark gold), formal rules and ornamental dividers

**Typography:**
- Section number: `Cormorant Garamond` Italic 11px / `#8B6E3A`
- Collection title: `Playfair Display` 72px / Bold Italic
- Subtitle: `DM Mono` 12px / uppercase / letter-spacing: 5px
- Product names: `Playfair Display` 20px / Italic 400
- Prices: `DM Mono` 14px / `#8B6E3A`

**Layout:**
```
[Crest/society logo centered — 160px]
[Thin ornamental rule above and below logo]
[Headline in Playfair Display — 2 lines]
[Subtitle in DM Mono — uppercase centered]
[2-column product grid — large photos — editorial studio shots]
[Footer of section: "WOVEN × University Societies 2025" in small Cormorant Italic]
```

**Decorative Detail:**
- Aged paper texture on `#D4C5B0` background (subtle)
- Thin double-rule borders (like academic certificates) framing the section
- Laurel leaf ornaments used as bullet points for feature callouts

**Animation:**
- Section fades in with a soft vignette — like opening a leather-bound book
- Product names underline slowly on hover (left to right, 400ms)

---

## 9. Supporting Pages

### 9.1 — Product Detail Page

**Layout:**
```
[Left — Product photo gallery, 60% width, sticky]
[Right — 40% width, scrollable]
  [Collection badge — themed pill]
  [Product name — collection display font]
  [Price — DM Mono]
  [Size selector — square buttons, no rounding]
  [Size guide link — opens modal]
  [Add to Cart — full width, 52px height, #111 bg, #F8F8F6 text]
  [Wishlist — ghost button below]
  [Accordion: Description / Material / Shipping / Care]
```

**HCI:** Image gallery swipe on mobile; keyboard-accessible size selector; sticky CTA on mobile bottom bar.

---

### 9.2 — Cart & Checkout

**Style:** Minimal, light, distraction-free  
**Background:** `#F8F8F6`  
**Checkout Steps:** Cart Review → Delivery → Payment → Confirm (progress bar top)  
**Font:** `DM Sans` throughout — switches to neutral for trust  
**HCI:** Progress indicator (reduces abandonment); editable quantities inline; no forced account creation.

---

### 9.3 — About / University Page

**Concept:** Woven's story told as a zine/editorial  
**Layout:** Full-bleed text sections alternating with photography  
**Font:** `Cormorant Garamond` for pull quotes; `DM Sans` for body  
**University section:** Campus ambassador cards, student discount explanation (verified via .edu email or NUST CMS ID format)

---

### 9.4 — Search

**Trigger:** Search icon in nav → full-screen overlay  
**Background:** `#1A1A1A`  
**Input:** Large 48px text field, `Cormorant Garamond`, white caret  
**Results:** Live-updating grid below input  
**HCI:** Auto-focus on open; Escape closes; recent searches persisted in localStorage.

---

## 10. Footer

**Background:** `#111111`  
**Text:** `#F8F8F6`  
**Accent:** `#C8A96E`

**Layout (4 columns):**
```
[Col 1] WOVEN wordmark + tagline + social icons (Instagram, TikTok, Pinterest)
[Col 2] Collections (links)
[Col 3] Info (About, Sustainability, University Program, Careers)
[Col 4] Newsletter signup — email input + "Stitch In" button
```

**Bottom bar:** `© 2025 Woven. All rights reserved. — Ideas Stitched Into Reality`  
**Font:** `DM Sans` 13px throughout; `Cormorant Garamond` Italic for wordmark

---

## 11. Motion & Animation Design Principles

### Global Rules
- All transitions: `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease)
- Hover transitions: 180–220ms
- Page transitions: 350ms fade + slight translateY
- Scroll reveals: `IntersectionObserver` at 0.15 threshold

### Scroll Reveal Pattern
```css
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

### Stagger Delay Formula
For grid items: `animation-delay: calc(var(--i) * 60ms)`

---

## 12. Accessibility & Responsive Design

### Accessibility
- All images: descriptive `alt` text
- Color is never the sole indicator of state
- Focus rings: 2px solid `#C8A96E` offset 3px (visible gold focus)
- Minimum touch target: 44×44px
- Screen reader labels on icon-only buttons

### Responsive Breakpoints
```
Mobile:  < 640px
Tablet:  640px – 1024px  
Desktop: > 1024px
Wide:    > 1440px
```

### Mobile-Specific Adaptations
- Bottom navigation bar: Home / Collections / Cart / Account
- Collection section fonts scale down: 72px → 48px → 32px
- Product grids: 2-col mobile / 3-col tablet / 4-col desktop
- Masonry grid (Street Stitch) becomes single column on mobile

---

## 13. Component Library Summary

| Component | Variants | Notes |
|---|---|---|
| Button | Primary / Ghost / Danger / Disabled | 2px radius, 48px height |
| Product Card | Default / Compact / Editorial | Hover reveals quick-add |
| Badge | Collection / Status / New / Sold Out | 0px radius, DM Mono |
| Navigation | Desktop / Mobile Overlay | Frosted blur |
| Size Selector | Available / Selected / OOS | Square, 40px |
| Toast | Success / Error | Slide up from bottom |
| Modal | Size Guide / Image Lightbox | Overlay, press Esc to close |
| Countdown | Drop Timer | Monospace, live |
| Accordion | Product Details | Animated height |
| Filter Panel | Sidebar / Mobile Drawer | Sticky on desktop |

---

## 14. Design Checklist (Pre-Launch)

- [ ] All font pairings tested at 100%, 75%, 50% viewport
- [ ] Every collection section has unique logo, font, and color treatment
- [ ] Glitch animations tested at `prefers-reduced-motion: reduce` (disable all motion)
- [ ] Cart accessible with keyboard-only navigation
- [ ] Product photos maintain 3:4 ratio across all cards
- [ ] Dark sections pass WCAG AA contrast
- [ ] Countdown timer tested across timezones (UTC-based)
- [ ] University discount flow end-to-end tested
- [ ] Mobile bottom bar doesn't overlap content
- [ ] All CTAs have loading states during API calls

---

*WOVEN Design System v1.0 — University Edition — SS25*  
*"Ideas Stitched Into Reality"*