# WOVEN - Theme System

## Overview

Woven has three themes:

- Classic
- Summer
- Winter

The active theme controls the website's UI, visual tone, hero media, accent colors, navbar, collection strip, logo direction, and Collections.

Classic is the current/default theme. Summer and Winter are distinct seasonal experiences.

## Theme Definitions

### Classic

- Status: current/default
- Product focus: plain clothes, formal clothes
- Visual direction: preserve the current Woven feel
- Logo references: existing `agents/logos-for-design/`

### Summer

- Product focus: T-shirts, pants, summer clothes
- Hero video: clear sunny sky with a family enjoying outdoors
- Title: `Woven`
- Tagline: warm, open, general-audience language
- Navbar: black background
- Infinite horizontal scroll bar: black background
- Accent: sky blue
- Text: black
- Logo references: pending user-provided Summer logos

### Winter

- Product focus: jackets, hoodies, winter clothes
- Hero video: snowflakes falling
- Title: `Woven`
- Tagline: cool, calm, general-audience language
- Navbar: snowflake white / ice white
- Infinite horizontal scroll bar: snowflake white / ice white
- Palette: cool whites, icy tones, soft grays
- Logo references: pending user-provided Winter logos

## Collections

Each theme has its own Collections. Collections are not global by default.

Examples:

- Classic Collections: plain essentials, formal edits, everyday refined pieces
- Summer Collections: T-shirts, pants, lightweight warm-weather sets
- Winter Collections: jackets, hoodies, cold-weather layers

See `agents/Themes/COLLECTIONS.md`.

## Theme Switcher

The website should include a visible switcher:

- Classic
- Summer
- Winter

When clicked, the theme change should spread across the screen as ripple waves from the click point, revealing the new theme as the wave expands.

The transition should feel like a stone dropped in water:

1. User clicks a theme option.
2. Click coordinates become the ripple origin.
3. The next theme appears inside expanding waves.
4. The waves cover the viewport.
5. The next theme becomes active.

Reduced-motion users should receive a simpler accessible transition.

## Documentation Structure

```text
agents/
  THEME_SYSTEM.md
  DESIGN.md
  ARCHITECTURE.md
  BEST_PRACTICES.md

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
    Classic logo references only
```

## Copy Guardrails

Woven now speaks to a general audience. Do not use copy that narrows the brand to an institution-specific or age-specific buyer.

Avoid language connected to legacy narrow-audience programs, institution-based verification, promotional eligibility, or non-product calendar framing.
