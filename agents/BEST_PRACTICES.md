# WOVEN — Best Practices Guide
### *Ideas Stitched Into Reality*

> This document governs every decision made during the design, development, and maintenance of the Woven website. It is the single source of truth for code quality, design consistency, accessibility, performance, and team collaboration standards.

---

## Table of Contents

1. [Design System Compliance](#1-design-system-compliance)
2. [Typography Rules](#2-typography-rules)
3. [Color & Theming Rules](#3-color--theming-rules)
4. [Tailwind CSS Strategy](#4-tailwind-css-strategy)
5. [Component Development](#5-component-development)
6. [Accessibility (A11y)](#6-accessibility-a11y)
7. [HCI & UX Principles](#7-hci--ux-principles)
8. [Performance](#8-performance)
9. [Responsive Design](#9-responsive-design)
10. [Animation & Motion](#10-animation--motion)
11. [Code Quality](#11-code-quality)
12. [Image & Asset Handling](#12-image--asset-handling)
13. [Forms & Input Handling](#13-forms--input-handling)
14. [State Management](#14-state-management)
15. [SEO & Metadata](#15-seo--metadata)
16. [Security](#16-security)
17. [Testing](#17-testing)
18. [Git & Version Control](#18-git--version-control)
19. [Content & Copywriting](#19-content--copywriting)
20. [Collection-Specific Rules](#20-collection-specific-rules)
21. [Do / Do Not Quick Reference](#21-do--do-not-quick-reference)
22. [Manual Notes](#22-manual-notes)

---

## 1. Design System Compliance

### Tailwind is the primary styling tool — raw CSS is the exception

All styling is done through Tailwind utility classes first. A `.css` file is only created when Tailwind cannot express the style (see Section 4 for the exact decision tree).

### Design tokens live in `tailwind.config.ts` — not in a CSS file

Every color, spacing value, font family, border radius, and transition is declared once in `tailwind.config.ts` under the `theme.extend` block. This makes them available as Tailwind utilities automatically.

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'woven-bg':        '#F8F8F6',
        'woven-surface':   '#EFEFED',
        'woven-dark':      '#1A1A1A',
        'woven-text':      '#111111',
        'woven-muted':     '#555555',
        'woven-inverse':   '#F8F8F6',
        'woven-accent':    '#C8A96E',
        'woven-accent-dk': '#8B6E3A',
        'woven-tan':       '#D4C5B0',
        'woven-glitch-bg': '#0D0D0D',
        'woven-cyan':      '#00FFFF',
        'woven-magenta':   '#FF00FF',
      },
      fontFamily: {
        'display':   ['"Cormorant Garamond"', 'serif'],
        'body':      ['"DM Sans"', 'sans-serif'],
        'mono':      ['"DM Mono"', 'monospace'],
        'syne':      ['"Syne"', 'sans-serif'],
        'grotesk':   ['"Space Grotesk"', 'sans-serif'],
        'ibm':       ['"IBM Plex Mono"', 'monospace'],
        'bebas':     ['"Bebas Neue"', 'sans-serif'],
        'marker':    ['"Permanent Marker"', 'cursive'],
        'rajdhani':  ['"Rajdhani"', 'sans-serif'],
        'playfair':  ['"Playfair Display"', 'serif'],
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      borderRadius: {
        'card':   '4px',
        'btn':    '2px',
        'badge':  '0px',
      },
      transitionDuration: {
        'hover': '200ms',
        'reveal': '600ms',
        'stamp': '400ms',
      },
    },
  },
}
```

Now in JSX you write `bg-woven-bg`, `text-woven-text`, `font-display`, `rounded-card` etc. — never raw values.

### Never hardcode values directly in className

```tsx
// ✅ CORRECT — uses Tailwind token
<div className="bg-woven-bg text-woven-text font-body">

// ❌ WRONG — raw value escaped into Tailwind
<div className="bg-[#F8F8F6] text-[#111111]">

// ❌ WRONG — inline style
<div style={{ backgroundColor: '#F8F8F6' }}>
```

The only exception to arbitrary values (`[]` syntax) is for one-off sizes that are genuinely not in the token system and will never repeat — e.g. a specific SVG viewBox-derived pixel value. Document every such exception with a comment.

---

## 2. Typography Rules

### One display font per collection — strictly enforced

Each of the 6 collection sections has an assigned display font. **Never use a collection's font outside its own section.** Cross-contamination destroys the brand segmentation.

| Collection | Display Font | Allowed Zones |
|---|---|---|
| Thread Classics | Cormorant Garamond | Section 3, product cards within |
| Minimal Edit | Syne | Section 4, product cards within |
| Digital Weave | Space Grotesk | Section 5, product cards within |
| Street Stitch | Bebas Neue | Section 6, product cards within |
| Glitch Drop | Rajdhani | Section 7, drop timers, notify UI |
| Society | Playfair Display | Section 8, product cards within |

### Global fonts are always DM Sans and DM Mono

- Body copy, UI labels, nav links → `DM Sans`
- Prices, metadata, tags, codes, timers → `DM Mono`
- Brand wordmark → `Cormorant Garamond` (this is the one exception — it is both a global and a collection font)

### Font loading — performance first

All fonts are loaded via `<link rel="preconnect">` and `font-display: swap`. Never block render for fonts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

```css
@font-face {
  font-display: swap; /* Always. No exceptions. */
}
```

### Type scale — use only these sizes

```
11px / 12px / 13px / 14px / 16px / 18px / 20px / 22px / 24px
28px / 32px / 36px / 40px / 48px / 56px / 64px / 72px / 80px / 96px / 120px
```

Never set a font size outside this scale. If a design calls for something in between, round to the nearest scale value.

### Line height rules

- Display / Headline text: `line-height: 1.05 – 1.15`
- Body text: `line-height: 1.6 – 1.7`
- UI labels / caps: `line-height: 1.2`
- Never set `line-height` in px — always unitless ratios

### Letter spacing rules

- Uppercase labels, tags, section numbers: `letter-spacing: 0.08em – 0.2em`
- Display headings (large): `letter-spacing: -0.02em – -0.04em` (tight for large text)
- Body text: `letter-spacing: 0` (default — never touch it)

---

## 3. Color & Theming Rules

### Background color is never pure white or pure black

- Light sections: `#F8F8F6` — always
- Dark sections: `#1A1A1A` — always
- Near-black (Glitch Drop): `#0D0D0D` — only for that section
- Tan/heritage: `#D4C5B0` — only for Society section

Pure `#FFFFFF` and `#000000` are banned from backgrounds. They exist only as reference values for contrast calculations.

### Accent gold is not decorative — it is semantic

`#C8A96E` signals: active state, hover underline, divider, price emphasis. It must not appear randomly for decoration. Every use of gold must mean something.

### Section background switching must follow the pattern

Dark and light sections must alternate predictably. Users should never encounter two consecutive dark or two consecutive light sections on the home page scroll without a deliberate reason.

```
Home scroll order:
Hero          → Light (#F8F8F6)
Thread        → Light (#F8F8F6)
Minimal Edit  → Soft (#EFEFED)
Digital Weave → Dark  (#1A1A1A)
Street Stitch → Mixed panels
Glitch Drop   → Near-black (#0D0D0D)
Society       → Tan  (#D4C5B0)
Uni Banner    → Dark (#111111)
Brand Story   → Light (#F8F8F6)
Footer        → Dark (#111111)
```

### Opacity for layering — approved values only

When overlaying textures, watermarks, or decorative elements, use only these opacity values:

```
Watermark logos:     4% (0.04)
Grain overlay:       5% (0.05)
Scanline texture:    4% (0.04)
Divider lines:       12% (0.12)
Secondary text:      55% (0.55)
Hover overlay:       80% (0.80)
```

---

## 4. Tailwind CSS Strategy

This is the core styling decision framework for Woven. Every developer must read and follow this before writing any styles.

---

### The Decision Tree — run this before writing any style

```
Need to style something?
│
├── Can Tailwind utilities express it exactly?
│   └── YES → Use Tailwind classes. Done.
│
├── Is it a complex animation (keyframes, glitch, scroll reveal)?
│   └── YES → Write a .css file. Import it into the component.
│
├── Is it a pseudo-element (::before, ::after) with complex logic?
│   └── YES → Write a .css file.
│
├── Is it a dynamic value driven by JavaScript state at runtime?
│   └── YES → Use inline style for ONLY that property.
│              Combine with Tailwind for everything else.
│
└── Is it a one-off arbitrary value that will never repeat?
    ├── YES → Use Tailwind arbitrary value [value] with a comment.
    └── NO  → Add it to tailwind.config.ts as a token instead.
```

---

### Rule 1 — Tailwind for everything structural

Layout, spacing, color, typography, borders, shadows, flex, grid — all Tailwind.

```tsx
// ✅ CORRECT — full Tailwind for a product card
<article className="
  bg-woven-surface
  rounded-card
  overflow-hidden
  flex flex-col
  transition-transform duration-hover ease-out
  hover:-translate-y-1
  hover:shadow-lg
">
  <div className="aspect-[3/4] overflow-hidden">
    <img className="w-full h-full object-cover" ... />
  </div>
  <div className="p-4 flex flex-col gap-2">
    <h3 className="font-display text-xl text-woven-text">Oversized Tee</h3>
    <span className="font-mono text-sm text-woven-muted">PKR 3,200</span>
  </div>
</article>
```

---

### Rule 2 — .css files only for these specific cases

| Case | Why Tailwind can't do it | Solution |
|---|---|---|
| `@keyframes` animations | Tailwind only ships preset `animate-*` | `.css` file with keyframes |
| CSS glitch effect (Glitch Drop) | Requires `clip-path` keyframes + `::before`/`::after` | `glitch.css` |
| Scroll reveal classes (`.reveal`, `.in-view`) | State toggled by JS IntersectionObserver | `animations.css` |
| Grain/scanline texture pseudo-elements | Complex `::after` with data URI | `textures.css` |
| SVG filter definitions (`<defs>`) | Not a CSS concern | Inline SVG in component |
| Custom `font-face` declarations | Already in `globals.css` | Keep in `globals.css` |

**Total expected `.css` files in the project:**

```
/styles/
  globals.css          ← @font-face, :root resets, font-display: swap
  animations.css       ← scroll reveal (.reveal, .in-view), stagger delays
  glitch.css           ← glitch keyframes — imported ONLY in GlitchDrop section
  textures.css         ← grain, scanline, paper ::after pseudo-elements
```

That's it. No other `.css` files should exist. If you feel the urge to create a fifth one, you probably need a Tailwind token or a component refactor instead.

---

### Rule 3 — Inline styles only for JS-driven dynamic values

```tsx
// ✅ CORRECT — stagger delay is runtime-computed, inline only for that property
<div
  className="opacity-0 translate-y-8 transition-all duration-reveal reveal"
  style={{ transitionDelay: `${index * 60}ms` }}
/>

// ✅ CORRECT — countdown timer width driven by state
<div
  className="h-1 bg-woven-cyan transition-all duration-1000"
  style={{ width: `${progressPercent}%` }}
/>

// ❌ WRONG — static value in inline style, should be Tailwind
<div style={{ padding: '16px', color: '#111111' }} />
```

---

### Rule 4 — Class organisation order inside `className`

Always write Tailwind classes in this order (matches Prettier Tailwind plugin):

```
Layout → Display / Position / Z-index
Sizing → Width / Height / Aspect ratio
Spacing → Margin / Padding / Gap
Typography → Font / Text / Leading / Tracking
Color → Background / Text color / Border color
Borders → Border width / Radius / Ring
Effects → Shadow / Opacity / Mix-blend
Transitions → Duration / Ease / Delay
States → hover: / focus: / active: / disabled:
Responsive → sm: / md: / lg: / xl:
```

Install `prettier-plugin-tailwindcss` and let it auto-sort. Do not fight the sort order.

```bash
npm install -D prettier-plugin-tailwindcss
```

---

### Rule 5 — Extract repeated class strings to a `cva` variant

If the same Tailwind class combination appears 3+ times across different components, extract it using `class-variance-authority` (CVA) rather than duplicating strings.

```ts
// /components/ui/button.ts
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  // base — always applied
  'inline-flex items-center justify-center font-body text-sm uppercase tracking-widest transition-colors duration-hover rounded-btn min-h-[52px] px-8',
  {
    variants: {
      intent: {
        primary: 'bg-woven-text text-woven-inverse hover:bg-woven-accent hover:text-woven-text',
        ghost:   'bg-transparent border border-woven-text text-woven-text hover:bg-woven-text hover:text-woven-inverse',
        danger:  'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'min-h-[52px] px-8',
        sm:      'min-h-[40px] px-5 text-xs',
        icon:    'min-h-[44px] min-w-[44px] p-0',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'default',
    },
  }
)
```

---

### Rule 6 — Collection theme switching via `data-` attributes

Each collection section receives a `data-collection` attribute. Tailwind's `data-*` variant selector applies the right overrides without a CSS file.

```tsx
// CollectionSection.tsx
<section
  data-collection={collection}   // e.g. "digital-weave"
  className="..."
>
```

```ts
// tailwind.config.ts — extend with collection data variants
theme: {
  extend: {
    // Tailwind v3.3+ supports data-* variants natively
  }
}
```

```tsx
// Usage in child component — font switches based on ancestor data attribute
<h2 className="
  font-display                             /* default */
  [section[data-collection=minimal-edit]_&]:font-syne
  [section[data-collection=digital-weave]_&]:font-grotesk
  [section[data-collection=street-stitch]_&]:font-bebas
  [section[data-collection=glitch-drop]_&]:font-rajdhani
  [section[data-collection=society]_&]:font-playfair
">
```

This keeps font switching fully CSS-driven with zero JavaScript.

---

### Rule 7 — `cn()` utility for conditional classes

Always compose conditional class strings through a `cn()` helper (combines `clsx` + `tailwind-merge`). Never use template literals or manual string concatenation.

```ts
// /lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```tsx
// ✅ CORRECT
<button className={cn(
  'bg-woven-text text-woven-inverse',
  isDisabled && 'opacity-40 cursor-not-allowed',
  isLoading && 'cursor-wait',
  className   // allow parent overrides
)}>

// ❌ WRONG — merge conflicts, specificity bugs
<button className={`bg-woven-text ${isDisabled ? 'opacity-40' : ''}`}>
```

---

### Tailwind config — full reference

```ts
// tailwind.config.ts — complete Woven configuration
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        woven: {
          bg:        '#F8F8F6',
          surface:   '#EFEFED',
          dark:      '#1A1A1A',
          'near-black': '#0D0D0D',
          tan:       '#D4C5B0',
          text:      '#111111',
          muted:     '#555555',
          inverse:   '#F8F8F6',
          border:    'rgba(17,17,17,0.12)',
          accent:    '#C8A96E',
          'accent-dk': '#8B6E3A',
          cyan:      '#00FFFF',
          magenta:   '#FF00FF',
        },
      },
      fontFamily: {
        display:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:     ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:     ['"DM Mono"', '"Courier New"', 'monospace'],
        syne:     ['"Syne"', 'sans-serif'],
        grotesk:  ['"Space Grotesk"', 'sans-serif'],
        ibm:      ['"IBM Plex Mono"', 'monospace'],
        bebas:    ['"Bebas Neue"', 'sans-serif'],
        marker:   ['"Permanent Marker"', 'cursive'],
        rajdhani: ['"Rajdhani"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs':  ['11px', { lineHeight: '1.2' }],
        'xs':   ['12px', { lineHeight: '1.2' }],
        'sm':   ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'md':   ['16px', { lineHeight: '1.65' }],
        'lg':   ['18px', { lineHeight: '1.5' }],
        'xl':   ['20px', { lineHeight: '1.4' }],
        '2xl':  ['22px', { lineHeight: '1.3' }],
        '3xl':  ['24px', { lineHeight: '1.2' }],
        '4xl':  ['28px', { lineHeight: '1.15' }],
        '5xl':  ['32px', { lineHeight: '1.1' }],
        '6xl':  ['40px', { lineHeight: '1.08' }],
        '7xl':  ['48px', { lineHeight: '1.05' }],
        '8xl':  ['64px', { lineHeight: '1.02' }],
        '9xl':  ['80px', { lineHeight: '1.0' }],
        '10xl': ['96px', { lineHeight: '1.0' }],
        '11xl': ['120px', { lineHeight: '0.95' }],
      },
      borderRadius: {
        'card':   '4px',
        'btn':    '2px',
        'badge':  '0px',
      },
      transitionDuration: {
        'hover':  '200ms',
        'reveal': '600ms',
        'stamp':  '400ms',
        'sweep':  '300ms',
      },
      transitionTimingFunction: {
        'woven':   'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'entrance':'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      aspectRatio: {
        'product': '3 / 4',
        'hero':    '16 / 9',
        'og':      '1200 / 630',
      },
      backdropBlur: {
        'nav': '12px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 5. Component Development

### Every component must be self-contained

A component owns its own markup, state, and Tailwind classes. It must not reach outside its boundary to affect siblings or parents. Since we use Tailwind, there are no scoped CSS files per component — isolation is achieved through props and composition.

```tsx
// ✅ CORRECT — component is self-contained, accepts className override
function ProductCard({ className, ...props }: ProductCardProps) {
  return (
    <article className={cn('bg-woven-surface rounded-card overflow-hidden', className)}>
      ...
    </article>
  )
}

// ❌ WRONG — component assumes it lives inside a specific parent
// (relies on parent .collections-grid to set its width)
```

### Props over hardcoded values

No component should have a hardcoded collection name, color, or font inside it. These come in as props, which map to Tailwind class strings via a lookup.

```tsx
// ✅ CORRECT — theme lookup table, not hardcoded logic
const collectionTheme = {
  'thread-classics': {
    bg: 'bg-woven-bg',
    text: 'text-woven-text',
    font: 'font-display',
    accent: 'text-woven-accent',
  },
  'digital-weave': {
    bg: 'bg-woven-dark',
    text: 'text-woven-inverse',
    font: 'font-grotesk',
    accent: 'text-woven-cyan',
  },
  // ...
} satisfies Record<CollectionId, CollectionTheme>

<CollectionSection collection="thread-classics" />

// ❌ WRONG — logic baked inside the component
if (section === 3) { className = 'font-display text-woven-text' }
```

### Component file structure

```
/components/
  /ui/                         ← headless/base components
    button.tsx
    badge.tsx
    accordion.tsx
    toast.tsx
    modal.tsx
  /product/
    ProductCard.tsx
    ProductCard.test.tsx
    ProductGrid.tsx
    SizeSelector.tsx
    QuickAddOverlay.tsx
  /collection/
    CollectionSection.tsx
    CollectionHeader.tsx
    CollectionCTA.tsx
  /drops/
    CountdownTimer.tsx
    DropCard.tsx
    NotifyMeForm.tsx
  /nav/
    GlobalNav.tsx
    MegaMenu.tsx
    MobileOverlay.tsx
  /layout/
    Footer.tsx
    Breadcrumb.tsx
    CollectionsStrip.tsx
```

No `.module.css` files per component. Styles live in the `className` prop via Tailwind. The only `.css` files in the project are the four global ones defined in Section 4.

### Minimum interactive target size

Every clickable element must be at minimum `44 × 44px` in its hit area, even if visually smaller. Use Tailwind padding to extend the tap zone.

```tsx
// ✅ CORRECT — visually 20px icon, 44px tap zone via padding
<button
  type="button"
  className="p-3 flex items-center justify-center"
  aria-label="Add to wishlist"
>
  <HeartIcon className="w-5 h-5" />  {/* 20px icon */}
</button>
{/* Total tap area: 20px icon + 12px padding each side = 44px */}
```

### Never use `<div>` for interactive elements

```html
<!-- ✅ CORRECT -->
<button type="button" onClick={handleWishlist}>♡</button>

<!-- ❌ WRONG -->
<div onClick={handleWishlist}>♡</div>
```

Divs are not keyboard accessible and have no implicit ARIA role.

---

## 6. Accessibility (A11y)

### WCAG AA is the minimum standard — strive for AAA on text

All text/background combinations must achieve a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text (18px+ or 14px+ bold).

Critical pairs to verify:

| Foreground | Background | Ratio | Status |
|---|---|---|---|
| `#111111` | `#F8F8F6` | 18.1:1 | ✅ AAA |
| `#F8F8F6` | `#1A1A1A` | 14.7:1 | ✅ AAA |
| `#C8A96E` | `#F8F8F6` | 2.9:1 | ⚠️ Large text only |
| `#00FFFF` | `#0D0D0D` | 14.2:1 | ✅ AAA |
| `#F8F8F6` | `#D4C5B0` | 1.5:1 | ❌ — Never use together |

The last row is why body text on the tan Society background must be `#1A1A1A`, not `#F8F8F6`.

### Every image must have a meaningful `alt` attribute

```html
<!-- ✅ CORRECT -->
<img src="oversized-tee-slate.jpg" alt="Oversized slate grey t-shirt from Thread Classics collection, front view" />

<!-- ❌ WRONG -->
<img src="oversized-tee-slate.jpg" alt="image" />
<img src="oversized-tee-slate.jpg" alt="" />   ← only acceptable for purely decorative images
```

### Focus states — never remove, always style

Add focus styles using Tailwind's `focus-visible:` variant. Never suppress outlines globally.

```tsx
// ✅ CORRECT — Tailwind focus-visible ring
<button className="
  ...
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-woven-accent
  focus-visible:ring-offset-2
">

// In globals.css — fallback for non-Tailwind elements
:focus-visible {
  outline: 2px solid theme('colors.woven.accent');
  outline-offset: 3px;
}

/* ❌ WRONG — accessibility killer */
* { outline: none; }
```

### Keyboard navigation must be fully functional

Every user flow — browse → product → add to cart → checkout — must be completable using only Tab, Shift+Tab, Enter, Space, Escape, and arrow keys.

Test checklist:
- [ ] Nav mega menu keyboard-navigable
- [ ] Size selector operable with arrow keys
- [ ] Modal/drawer closeable with Escape
- [ ] Cart quantity adjustable with keyboard
- [ ] Checkout forms fully Tab-navigable

### Screen reader — use semantic HTML and ARIA correctly

```html
<!-- Product card with proper semantics -->
<article aria-label="Woven Oversized Tee — Thread Classics">
  <img alt="..." />
  <h3>Oversized Tee</h3>
  <p aria-label="Price">PKR 3,200</p>
  <button aria-label="Add Oversized Tee to cart">Add to Cart</button>
</article>
```

### Live regions for dynamic content

Cart count, toast notifications, and countdown timer updates must use `aria-live`:

```html
<span aria-live="polite" aria-atomic="true">
  3 items in cart
</span>

<div role="status" aria-live="assertive">
  Item added to cart ✓
</div>
```

### Respect user motion preferences

Tailwind's `motion-reduce:` variant handles this automatically for class-based animations. For `.css` keyframe animations, add the global override in `animations.css`:

```css
/* animations.css */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .glitch-title::before,
  .glitch-title::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

For Tailwind-only transitions, prefix with `motion-safe:`:

```tsx
// Only animates if user has no motion preference
<div className="motion-safe:transition-transform motion-safe:duration-reveal motion-safe:hover:-translate-y-1">
```

---

## 7. HCI & UX Principles

### Visibility of system status — always show feedback

| User Action | Required Feedback | Timing |
|---|---|---|
| Add to cart | Toast: "Added to cart ✓" | Immediate |
| Remove from cart | Toast: "Item removed" | Immediate |
| Submit notify me | "You're on the list ✓" | Immediate |
| Checkout submit | Loading spinner on button | During request |
| Student verify | Inline status indicator | During + after |
| Form error | Red border + error text below field | On blur/submit |
| Out of stock size | Strikethrough + muted style | Always visible |

### Error prevention over error recovery

Design to prevent mistakes before they happen:

- Show size guide **before** the add-to-cart button, not after
- Confirm quantity changes inline before cart updates
- Disable checkout CTA until all required fields are valid
- "Are you sure?" prompt for removing the last item from cart
- Never auto-clear form fields on a failed submission

### Recognition over recall — minimize memory load

- Product images persist in cart sidebar so users remember what they added
- Breadcrumbs always show the full navigation path
- Filter selections remain visible as active pills above the product grid
- Recently viewed products strip on product pages

### Consistency — same pattern everywhere

| Element | Consistent Rule |
|---|---|
| All primary CTAs | `#111111` bg, `#F8F8F6` text, 52px height, 2px radius |
| All ghost buttons | Transparent bg, `#111111` border 1px, same dimensions |
| All section numbers | `DM Mono` 11px uppercase, top-left, collection accent color |
| All price displays | `DM Mono` font, no currency symbol styling variation |
| All hover states | 180–220ms transition, never instant |

### Progressive disclosure

Show only what the user needs at each step. Do not overwhelm.

- Product card (grid): photo + name + price only
- Product card (hover): + quick size selector + add button
- Product detail page: full information, accordion for secondary details
- Checkout: one step at a time with clear progress

### Fitts's Law — size and proximity matter

- Primary CTA (Add to Cart) is always the largest, most prominent button on the page
- On mobile, all primary actions appear in the bottom 30% of the screen (thumb zone)
- Destructive actions (Remove item) are small, separated from primary actions
- Related products must be reachable without scrolling past the fold on desktop

---

## 8. Performance

### Target metrics (Lighthouse scores)

| Metric | Target |
|---|---|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### Images — always optimized

- Use `next/image` (or equivalent) for automatic WebP conversion and lazy loading
- Always specify `width` and `height` to prevent layout shift (CLS)
- Above-the-fold hero image: `priority` prop / `loading="eager"`
- All other images: `loading="lazy"` (default)
- Product photos: served at 2× resolution for retina, but sized to actual display dimensions
- Never ship a PNG over 200KB without compression

```jsx
// ✅ CORRECT
<Image
  src="/products/tee-slate.jpg"
  alt="Oversized slate tee"
  width={600}
  height={800}
  sizes="(max-width: 640px) 50vw, 25vw"
/>
```

### Font subsetting

Only load the character subsets actually used:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&display=swap&subset=latin" />
```

Do not load all weights of every font. Map out exactly which weights are used in `Design.md` and load only those.

### Code splitting

- Each collection section is lazy-loaded — it does not block the initial page render
- The Glitch Drop section (heaviest animations) loads only when it enters the viewport
- The checkout Stripe embed loads only on `/checkout/payment/`

### Critical CSS

Above-the-fold styles (nav, hero) are inlined. All other styles load asynchronously.

### No layout shift rules

- Reserve space for images before they load with `aspect-ratio` CSS
- Reserve space for fonts with a well-matched system fallback font
- Never insert banners or elements above existing content after load

```css
.product-photo {
  aspect-ratio: 3 / 4;  /* locks space before image loads */
  background: var(--color-surface); /* placeholder bg */
}
```

---

## 9. Responsive Design

### Mobile-first — always write base styles for mobile, add `sm:` `md:` `lg:` for larger screens

Tailwind is already mobile-first by default. Do not fight it with `max-w-*` hacks.

```tsx
// ✅ CORRECT — Tailwind mobile-first responsive
<h2 className="text-7xl md:text-9xl lg:text-10xl font-display leading-none">
  Thread Classics
</h2>

// ✅ CORRECT — clamp for fluid scaling (use sparingly, only for hero-scale type)
// goes in globals.css since Tailwind can't express clamp() on custom scales
// .hero-headline { font-size: clamp(40px, 8vw, 96px); }

// ❌ WRONG — desktop-first with max-width override
// Don't do this in Tailwind — write sm:/md:/lg: instead
```

### Breakpoints — Tailwind defaults match Woven's system

| Prefix | Min-width | Woven usage |
|---|---|---|
| (none) | 0px | Mobile base |
| `sm:` | 640px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide |
| `2xl:` | 1536px | Ultra-wide clamp |

### Mobile-specific layout changes via Tailwind

| Element | Mobile class | Desktop override |
|---|---|---|
| Product grid | `grid-cols-2` | `lg:grid-cols-4` |
| Hero headline | `text-7xl` | `lg:text-10xl` |
| Detail split | `flex-col` | `lg:flex-row` |
| Nav | `hidden` (links) | `lg:flex` |
| Bottom tab bar | `flex lg:hidden` | — |
| Filter panel | `fixed bottom-0` | `lg:sticky lg:top-24` |

---

## 10. Animation & Motion

### The 3-second rule

No animation on the page should run for longer than 3 seconds on first load. After that, only loop animations (glitch, countdown) may continue indefinitely.

### Timing functions — use Tailwind tokens from tailwind.config.ts

The three timing functions are registered as tokens (`ease-woven`, `ease-spring`, `ease-entrance`) and used via Tailwind classes:

```tsx
// Hover transitions
<div className="transition-transform duration-hover ease-woven hover:-translate-y-1">

// Scroll reveal entrance
<div className="transition-all duration-reveal ease-entrance">

// Stamp impact (Logo 9)
<div className="transition-transform duration-stamp ease-spring">
```

### Scroll reveal — Tailwind classes toggled by IntersectionObserver

```tsx
// useScrollReveal.ts hook
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Usage in component
const { ref, isInView } = useScrollReveal()

<div
  ref={ref}
  className={cn(
    'transition-all duration-reveal ease-entrance',
    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  )}
  style={{ transitionDelay: `${index * 60}ms` }}
/>
```

### Stagger delays — inline style only (runtime value)

```tsx
// ✅ CORRECT — delay is computed, inline style is the right tool
{products.map((product, i) => (
  <ProductCard
    key={product.id}
    style={{ transitionDelay: `${i * 60}ms` }}
    className={cn(
      'transition-all duration-reveal ease-entrance',
      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    )}
  />
))}
```

### Glitch animation — in `glitch.css`, scoped to GlitchDrop only

The glitch keyframes live in `/styles/glitch.css` and are imported **only** inside the `GlitchDrop` section component. This file must never be imported globally.

```css
/* glitch.css */
@keyframes glitch-shift {
  0%, 100% { clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
  25%       { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
  50%       { clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); }
}

.glitch-title::before {
  animation: glitch-shift 2s infinite;
}
.glitch-title::after {
  animation: glitch-shift 2s infinite 0.1s;
}
```

```tsx
// GlitchDrop.tsx — only here
import '/styles/glitch.css'
```

### Never animate these properties

```
❌ width / height       → use transform: scaleX() / scaleY()
❌ top / left           → use transform: translate()
❌ margin / padding     → use transform or gap
❌ display              → use opacity + pointer-events-none
❌ font-size            → never animate type

✅ transform (translate, scale, rotate)
✅ opacity
✅ clip-path  (GPU-composited)
✅ filter     (sparingly — can be expensive)
```

---

## 11. Code Quality

### File & folder naming

```
kebab-case      → all files and folders
PascalCase      → React component filenames only
SCREAMING_CASE  → environment variables and constants only

/components/product/
  ProductCard.tsx          ← PascalCase component
  ProductCard.test.tsx
  ProductGrid.tsx

(no .module.css files — Tailwind handles all styles)
```

NEXT_PUBLIC_STRIPE_KEY        ← env var: SCREAMING_CASE
```

### TypeScript — strict mode, always

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

No `any` types. If you need to escape the type system, use `unknown` and narrow explicitly.

### Function and variable naming

```ts
// ✅ Descriptive, verb-first for functions
function addItemToCart(item: CartItem): void { }
function formatPrice(cents: number): string { }
function isStudentVerified(email: string): boolean { }

// ✅ Noun-first for data
const cartItems: CartItem[] = []
const currentCollection: Collection = 'thread-classics'

// ❌ Too vague
function handle() { }
const data = []
const x = true
```

### No magic numbers

```ts
// ✅ CORRECT — named constant
const STUDENT_DISCOUNT_RATE = 0.15
const MAX_CART_QUANTITY = 10
const DROP_COUNTDOWN_DAYS = 7

// ❌ WRONG — magic number in logic
if (discount > 0.15) { ... }
if (quantity > 10) { ... }
```

### Environment variables

```
NEXT_PUBLIC_*   → safe to expose to browser
(no prefix)     → server-only, never in client code
```

Never hardcode API keys, Stripe secrets, or database URLs anywhere in source code.

### CSS specificity — keep it flat

```css
/* ✅ CORRECT — low specificity */
.product-card { }
.product-card-title { }

/* ❌ WRONG — specificity war */
.collections-grid .product-card .title span { }
#section-3 .card > h3 { }
```

Never use `!important` except in the `prefers-reduced-motion` override block (which is intentional).

---

## 11. Image & Asset Handling

### Directory structure

```
/public/
  /images/
    /products/        ← product photography
    /collections/     ← collection hero images
    /logos/           ← all 9 logo variants (SVG preferred)
    /textures/        ← grain, scanline, paper texture overlays
    /ambassadors/     ← university ambassador photos
  /icons/             ← SVG icon set
  /fonts/             ← self-hosted font fallbacks (if any)
```

### Logo files — SVG only

All 9 logo variants from the design sheet must be stored as SVGs (not PNG or JPG). SVGs scale perfectly and can receive CSS color/filter treatments needed for glitch and watermark effects.

```
/public/images/logos/
  logo-01-interlocked-thread.svg
  logo-02-stitched-typography.svg
  logo-03-broken-grid.svg
  logo-04-circular-emblem.svg
  logo-05-japanese-minimal.svg
  logo-06-glitch-w.svg
  logo-07-crest-society.svg
  logo-08-abstract-fold.svg
  logo-09-brutalist.svg
```

### Product photo specifications

| Property | Specification |
|---|---|
| Aspect ratio | 3:4 (portrait) — strict |
| Minimum resolution | 1200 × 1600px |
| Format | WebP (primary), JPG (fallback) |
| Max file size | 150KB after compression |
| Background | Pure `#F8F8F6` for Thread Classics / Minimal Edit / Society |
| Background | Dark studio for Digital Weave / Glitch Drop |
| Background | Location/lifestyle for Street Stitch |

### Texture files

Grain, scanline, and paper textures are SVG filters or tiny PNG tiles — never large raster images.

```css
/* Grain — SVG filter approach (no extra file) */
.grain-overlay {
  position: relative;
}
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");  /* inline SVG noise */
  opacity: 0.05;
  pointer-events: none;
}
```

---

## 12. Forms & Input Handling

### Never use `<form>` with default submit in React

All form submissions are handled programmatically via `onClick` or `onSubmit` with `e.preventDefault()`.

```tsx
// ✅ CORRECT
function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  await submitOrder(formData)
}

<form onSubmit={handleSubmit}>
```

### Input validation

- Client-side validation for UX feedback (immediate, on blur)
- Server-side validation for security (always, regardless of client)
- Never trust client-side validation alone

```tsx
// ✅ Validate on blur (not on every keystroke — avoids premature errors)
<input
  onBlur={(e) => validateEmail(e.target.value)}
  aria-describedby="email-error"
/>
{emailError && (
  <span id="email-error" role="alert" style={{ color: 'red' }}>
    {emailError}
  </span>
)}
```

### Student email verification

The university discount verification must:
1. Accept `.edu.pk` domains and known Pakistani university formats
2. Send a verification email — never trust the field value alone
3. Rate-limit verification attempts (max 5 per hour per IP)
4. Never expose which emails are registered in error messages

### Payment forms

- Never handle raw card data — use Stripe Elements exclusively
- Stripe iframe renders in a sandboxed environment
- PCI compliance is maintained by never touching card numbers in our code

---

## 13. State Management

### What lives where

| State Type | Location |
|---|---|
| Cart items | Zustand store + localStorage sync |
| Wishlist | Zustand store + localStorage sync |
| Auth/session | Server session (HTTP-only cookie) |
| UI state (modals, drawers) | Local React state (`useState`) |
| Form state | Local React state or React Hook Form |
| Product data | Server-fetched, cached with SWR/React Query |
| Drop countdown | Derived from server timestamp, not client clock |

### Cart persistence

Cart is synced to `localStorage` so it survives page refresh:

```ts
// Zustand with persistence middleware
const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
    }),
    { name: 'woven-cart' }
  )
)
```

### Drop countdown — always server-authoritative

Never derive the countdown from `new Date()` on the client alone. Fetch the drop timestamp from the server on mount and calculate from there. This prevents timezone exploits.

```ts
const { data: dropTime } = useSWR('/api/drops/next', fetcher)
const remaining = dropTime ? dropTime - Date.now() : null
```

---

## 14. SEO & Metadata

### Every page must have unique metadata

```tsx
// Next.js example
export const metadata = {
  title: 'Thread Classics — Woven | Ideas Stitched Into Reality',
  description: 'Foundation pieces for the university wardrobe. Premium essentials, designed for students.',
  openGraph: {
    title: 'Thread Classics — Woven',
    description: '...',
    image: '/og/thread-classics.jpg',
    type: 'website',
  },
}
```

### OG image specifications

- Size: `1200 × 630px`
- One per collection (uses collection logo + dark/light bg)
- Stored at `/public/og/[collection-name].jpg`

### Structured data for products

Every product detail page includes JSON-LD:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Woven Oversized Tee",
  "brand": { "@type": "Brand", "name": "Woven" },
  "offers": {
    "@type": "Offer",
    "price": "3200",
    "priceCurrency": "PKR",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### URL structure is clean and descriptive

```
✅ /collections/thread-classics/oversized-tee-slate
❌ /products?id=1847&cat=3
```

---

## 15. Security

### Environment secrets — never in client code

```ts
// ❌ WRONG — exposed to browser bundle
const stripeKey = 'sk_live_xxxxx'

// ✅ CORRECT — server-only
// In /app/api/checkout/route.ts (server route)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
```

### Input sanitization

All user-provided content (names, addresses, form fields) must be sanitized before display to prevent XSS:

```ts
import DOMPurify from 'dompurify'
const safeName = DOMPurify.sanitize(userInput)
```

### Content Security Policy (CSP)

A strict CSP header is set in `next.config.js`. Inline scripts and styles are disallowed except via nonce. The Stripe iframe is explicitly whitelisted.

### Rate limiting

All public POST endpoints are rate-limited:
- Newsletter signup: 3 per IP per hour
- Student verification: 5 per IP per hour
- Notify Me (drops): 10 per IP per hour
- Checkout: 20 per session per hour

---

## 16. Testing

### Testing pyramid

```
Unit Tests (most)
  └── Individual functions: formatPrice, validateEmail, cartReducer

Component Tests (medium)
  └── ProductCard renders correctly
  └── SizeSelector accessible and functional
  └── CartToast appears and dismisses

Integration Tests (fewer)
  └── Add to cart → cart count updates
  └── Student verify flow → discount applies
  └── Checkout step progression

E2E Tests (fewest, highest value)
  └── Browse → Add to Cart → Checkout → Order confirmation
  └── Filter products → view detail → wishlist
```

### What must have tests

| Feature | Test Type | Priority |
|---|---|---|
| `formatPrice()` | Unit | Critical |
| `validateStudentEmail()` | Unit | Critical |
| `cartReducer` | Unit | Critical |
| `<ProductCard>` renders | Component | High |
| `<SizeSelector>` a11y | Component | High |
| Add to cart flow | Integration | High |
| Checkout E2E | E2E | Critical |
| Student discount E2E | E2E | High |

### Accessibility testing

Run `axe-core` in the test suite against every page. Zero accessibility violations is the standard.

```ts
import { axe } from 'jest-axe'

test('ProductCard has no a11y violations', async () => {
  const { container } = render(<ProductCard {...mockProps} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 17. Git & Version Control

### Branch naming

```
main              ← production — never commit directly
dev               ← integration branch
feature/[name]    ← new features
fix/[name]        ← bug fixes
chore/[name]      ← dependency updates, config changes
design/[name]     ← visual/design-only changes

Examples:
feature/glitch-drop-countdown
fix/mobile-cart-overlap
design/society-section-typography
```

### Commit message format

```
[type]: short description (max 72 chars)

[optional body — explain WHY, not what]

Types:
feat     → new feature
fix      → bug fix
style    → CSS/visual changes, no logic change
refactor → code restructure, no behavior change
perf     → performance improvement
a11y     → accessibility improvement
docs     → documentation only
chore    → tooling, dependencies
test     → test additions or changes
```

```
✅ feat: add countdown timer to Glitch Drop section
✅ fix: size selector not closing on mobile tap outside
✅ a11y: add aria-live region to cart count badge
✅ style: update Society section to Playfair Display 72px

❌ fixed stuff
❌ WIP
❌ asdfasdf
```

### Pull request rules

- Every PR requires at least 1 review before merge to `dev`
- PRs to `main` require 2 reviews + passing CI
- No PR merges with failing tests
- Include screenshots for any visual change PRs

---

## 18. Content & Copywriting

### Brand voice

Woven speaks to university students as equals — not as a brand talking down to consumers.

| ✅ Woven Voice | ❌ Not Woven Voice |
|---|---|
| Direct, confident | Corporate, distant |
| A little poetic | Overly formal |
| Culturally aware | Generic |
| Concise | Padded with filler |
| Smart, not trying hard | Trying too hard to be cool |

### Copywriting rules

- Headlines: Title Case for display / all-caps for brutalist sections only
- Body: Sentence case always
- CTAs: Action verb first — "Explore," "Add," "Verify," "Notify Me"
- Price display: Always include currency — `PKR 3,200` (not `3200` or `Rs. 3,200`)
- Avoid: "luxurious," "premium quality," "world-class" — too generic
- Preferred: Specific, sensory language — "brushed cotton," "relaxed drop shoulder," "heavyweight 320gsm"

### Error messages — human, not robotic

```
✅ "That email doesn't look right — double-check and try again."
❌ "Error 422: Invalid email format."

✅ "We couldn't process your payment. Try a different card or contact your bank."
❌ "Payment failed."

✅ "This size is all gone — hit Notify Me and we'll tell you if it comes back."
❌ "Out of stock."
```

---

## 19. Collection-Specific Rules

These rules extend the global practices and apply only within the named collection's code and design.

### Thread Classics
- Gold accent (`#C8A96E`) used more liberally here than anywhere else
- All product photos: clean `#F8F8F6` background — no exceptions
- No animations faster than 400ms — this is the "slow and refined" collection

### Minimal Edit
- Maximum 3 typefaces on screen at any time (Syne display + DM Sans body + DM Mono price)
- Whitespace is a design element — do not fill gaps
- No decorative elements except the single 0.5px full-width rule

### Digital Weave
- All interactive elements get a cyan (`#00FFFF`) focus/hover state — overrides global gold
- The globe icon from Logo 3 is the only decorative element permitted outside the logo itself
- Product card borders always `1px solid #444` at rest — never invisible

### Street Stitch
- The grain filter is applied at SVG level, not CSS filter — performance reason
- Masonry grid is JavaScript-calculated, not CSS grid-based, for true irregular heights
- `Permanent Marker` font is display-only — never use it for body, labels, or prices

### Glitch Drop
- The glitch CSS animation must be wrapped in `will-change: transform` for GPU promotion
- Countdown timer syncs from server every 60 seconds — never drift client-only
- "SOLD OUT" stamp is a rotated `<span>` element, not an image overlay
- Cyan and magenta accents are only used here — zero bleed into other sections

### Society Collection
- Ornamental rules are `<hr>` elements styled with CSS — not images
- The aged paper texture is a CSS `background-image` with a base64-encoded SVG noise pattern
- Laurel ornaments are Unicode characters (`✦`, `—`) styled with CSS — not icon images

---

## 20. Do / Do Not Quick Reference

### Design

| ✅ DO | ❌ DO NOT |
|---|---|
| Use `#F8F8F6` for all light backgrounds | Use `#FFFFFF` anywhere |
| Use design tokens for every value | Write raw hex or px values |
| Assign each collection its own font | Use one font across all sections |
| Let whitespace breathe in Minimal Edit | Fill every gap with content |
| Match logo to collection precisely | Use logos interchangeably |
| Keep glitch effects in Glitch Drop only | Glitch anything outside that section |
| Scale headlines with `clamp()` | Use fixed px on mobile |
| Use gold accent meaningfully | Use gold for decoration |

### Code

| ✅ DO | ❌ DO NOT |
|---|---|
| Write mobile-first CSS | Write desktop-first with max-width overrides |
| Use semantic HTML elements | Use `<div>` for buttons or links |
| Provide `alt` text for all images | Leave `alt=""` on meaningful images |
| Animate `transform` and `opacity` | Animate `width`, `height`, `top`, `left` |
| Validate on both client and server | Trust client validation alone |
| Use `font-display: swap` | Block render waiting for fonts |
| Respect `prefers-reduced-motion` | Hardcode animations with no override |
| Test a11y with axe-core | Ship without accessibility testing |

### Content

| ✅ DO | ❌ DO NOT |
|---|---|
| Write direct, specific copy | Use vague superlatives ("world-class") |
| Show human error messages | Show raw error codes |
| Display prices as `PKR 3,200` | Show `3200` or `Rs3200` |
| Use action-first CTA copy | Use "Click here" or "Submit" |
| Write `alt` text describing the clothing | Write `alt="product image"` |

---

*WOVEN Best Practices v1.0 — University Edition — SS25*
*"Ideas Stitched Into Reality"*