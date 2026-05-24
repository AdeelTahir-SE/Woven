# WOVEN - Design System

## Brand Overview

Woven is a general-audience clothing brand built around expressive, theme-led collections. The website should feel refined, visual, and fashion-forward while remaining simple to browse.

## Core Brand Positioning

- Brand name: Woven
- Default tagline: Ideas Stitched Into Reality
- Audience: general clothing customers
- Personality: expressive, refined, modern, tactile
- Product promise: clothing that fits real life while carrying a distinct visual identity

Avoid audience-specific language. Do not frame the brand around a narrow buyer group, course, institution, or age range.

## Theme System

The design system has three themes:

- Classic
- Summer
- Winter

Classic is the current/default theme and should stay visually familiar unless the user asks for a redesign. Summer and Winter should feel like full visual worlds, not only color swaps.

See `agents/THEME_SYSTEM.md` and the files inside `agents/Themes/` for theme-specific rules.

## Shared Visual Rules

- The active theme controls background, navbar, accent color, collection strip, hero media, and supporting surfaces.
- Typography should remain readable and polished across all themes.
- Color contrast must meet WCAG AA for body text.
- Buttons, links, focus states, and active states must use the active theme tokens.
- Components should not hardcode a specific theme.

## Classic Theme Summary

Classic keeps the current/default site feel.

- Product focus: plain clothes, formal clothes, refined daily wear
- Mood: clean, composed, timeless
- Existing logo references: `agents/logos-for-design/`
- Hero: keep current/default unless changed later

## Summer Theme Summary

Summer is bright, open, and outdoor.

- Product focus: T-shirts, pants, summer clothes
- Hero video: clear sunny sky with a family enjoying outdoors
- Hero title: `Woven`
- Hero tagline: theme-specific, warm, general-audience language
- Navbar: black background
- Infinite horizontal scroll bar: black background
- Accent color: sky blue
- Remaining text: black

## Winter Theme Summary

Winter is cool, crisp, and snow-inspired.

- Product focus: jackets, hoodies, winter clothes
- Hero video: snowflakes falling
- Hero title: `Woven`
- Hero tagline: theme-specific, calm, general-audience language
- Navbar: snowflake white / ice white
- Infinite horizontal scroll bar: snowflake white / ice white
- Palette: cool whites, icy blues, soft grays

## Theme Switcher Design

The theme switcher must contain:

- Classic
- Summer
- Winter

The selected theme should be visually clear. The switcher should work in the navbar or another globally visible area.

Theme changes must use a ripple-wave reveal from the click point. The new theme should appear as expanding waves crossing the screen, like water ripples from a dropped stone.

Reduced-motion users should receive a softened fade or immediate accessible fallback.

## Logo Direction

The existing `agents/logos-for-design/` files were selected for the Classic theme. Treat them as Classic-only references.

Summer and Winter will receive their own theme-specific logo references later. Do not reuse Classic logo rules for Summer or Winter unless the user explicitly asks for that.

## Copy Rules

Use broad, inclusive fashion language.

Good examples:

- Everyday pieces with a distinct point of view.
- Built for warm days, open skies, and easy movement.
- Layers for cold air, quiet mornings, and sharp winter light.

Avoid:

- narrow-audience language
- institution-specific language
- seasonal-calendar framing unrelated to the clothes
- eligibility-led positioning
- promotional-first positioning

## Visual QA Checklist

- The active theme is obvious above the fold.
- Hero title and tagline are readable over media.
- Navbar matches the active theme.
- Collection strip matches the active theme.
- Theme switcher state is clear.
- Ripple transition originates from the click point.
- No copy references old audience-specific positioning.
