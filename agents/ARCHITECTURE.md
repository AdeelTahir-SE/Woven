# WOVEN - Site Architecture

## Purpose

This document defines the website structure agents should follow when planning or implementing Woven features. Woven is a general-audience clothing brand with a theme system built around Classic, Summer, and Winter.

The current implementation target is documentation only. Do not implement code from this file until the user asks for website changes.

## Theme-First Site Model

The active theme controls the visible mood of the website:

- Classic: current/default experience, focused on plain clothes and formal clothes.
- Summer: warm-weather experience, focused on T-shirts, pants, and summer clothes.
- Winter: cold-weather experience, focused on jackets, hoodies, and winter clothes.

Each theme owns its own Collections. Collections should be presented as sub-sections within the active theme rather than as one global collection list shared by every theme.

## Proposed Route Structure

```text
/
  #hero
  #theme-switcher
  #collections-strip
  #active-theme-collections
  #featured-products
  #brand-story
  #newsletter

/collections/
  /collections/classic/
  /collections/classic/[collectionSlug]/
  /collections/summer/
  /collections/summer/[collectionSlug]/
  /collections/winter/
  /collections/winter/[collectionSlug]/

/products/
  /products/[slug]/

/drops/
  #upcoming
  #active
  #archive

/about/
  #brand-story
  #materials
  #craft
  #contact

/search/
/cart/
/checkout/
  /checkout/delivery/
  /checkout/payment/
  /checkout/confirm/

/account/
  /account/orders/
  /account/wishlist/
  /account/settings/

/login/
/signup/

/legal/
  /legal/privacy/
  /legal/terms/
  /legal/returns/
```

## Removed Routes And Concepts

Do not create or preserve routes, sections, APIs, or copy for legacy narrow-audience programs, eligibility checks, or audience-specific promotional flows.

Woven now targets a general audience.

## Home Page Structure

### Hero

The hero is theme-aware.

- Classic keeps the current/default hero treatment unless explicitly changed later.
- Summer uses a clear sunny sky outdoor family video background.
- Winter uses a falling snowflakes video background.

The hero must always display:

- Title: `Woven`
- Theme-appropriate tagline below the title
- Strong visual contrast over the video or background

### Theme Switcher

The site needs a visible switcher with:

- Classic
- Summer
- Winter

Switching themes must feel physical and deliberate. When the user clicks a theme option, the new theme should be revealed by ripple waves expanding from the click point, like a stone dropped in water. The origin point must use the actual click coordinates.

### Collections Strip

The infinite horizontal scroll bar is theme-aware.

- Classic follows current/default styling.
- Summer uses a black background.
- Winter uses a snowflake white / ice white background.

The strip content should show only the Collections that belong to the active theme.

## Data Model Guidance

Use a theme-first structure:

```ts
type ThemeId = 'classic' | 'summer' | 'winter'

type Theme = {
  id: ThemeId
  label: string
  tagline: string
  hero: ThemeHero
  palette: ThemePalette
  collections: Collection[]
  logoSet: ThemeLogoSet
}

type Collection = {
  slug: string
  title: string
  description: string
  productFocus: string[]
}
```

Collections should be resolved from the active theme, not hardcoded inside components.

## Assets

Theme assets should be organized by theme.

```text
public/
  videos/
    themes/
      summer/
      winter/
  images/
    themes/
      classic/
      summer/
      winter/
  logos/
    classic/
    summer/
    winter/
```

The existing `agents/logos-for-design/` references belong to Classic only. Summer and Winter logo references will be added later by the user.

## Agent Documentation Map

```text
agents/
  ARCHITECTURE.md
  DESIGN.md
  BEST_PRACTICES.md
  THEME_SYSTEM.md

  Themes/
    COLLECTIONS.md
    Classic/
      README.md
      LOGOS.md
    Summer/
      README.md
      LOGOS.md
    Winter/
      README.md
      LOGOS.md

  logos-for-design/
    Classic logo references only for now
```

## Implementation Notes For Future Code Work

- Read the relevant Next.js guide in `node_modules/next/dist/docs/` before changing app code.
- Keep theme state centralized.
- Avoid hardcoded colors in components; use theme tokens.
- Keep motion accessible with reduced-motion support.
- Do not implement an instant theme swap; the transition is part of the product feel.
