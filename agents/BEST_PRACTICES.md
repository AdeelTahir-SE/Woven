# WOVEN - Best Practices Guide

## Purpose

This guide defines how agents should make future changes to the Woven website. For now, the theme system is documented only. Do not change website code unless the user asks for implementation.

## Next.js Rule

This project uses a Next.js version with breaking changes. Before editing app code, read the relevant guide in:

```text
node_modules/next/dist/docs/
```

Do not rely only on prior Next.js knowledge.

## Design Source Of Truth

Use these files together:

- `agents/THEME_SYSTEM.md` for the full theme model
- `agents/DESIGN.md` for visual direction
- `agents/ARCHITECTURE.md` for structure and route planning
- `agents/Themes/Classic/README.md` for Classic details
- `agents/Themes/Summer/README.md` for Summer details
- `agents/Themes/Winter/README.md` for Winter details
- `agents/Themes/COLLECTIONS.md` for collection rules

## Theme Development Principles

- Treat Classic, Summer, and Winter as complete themes.
- Do not make Summer or Winter feel like small color variations of Classic.
- The active theme controls hero media, navbar, accents, collection strip, typography mood, surfaces, and collection content.
- Do not hardcode theme values inside components.
- Centralize theme data and pass it into components.
- Collections must come from the active theme.

## Theme Switcher Rules

The website needs a theme switcher with:

- Classic
- Summer
- Winter

When a user clicks a theme option, the transition should not be instant. It should reveal the new theme through ripple waves expanding from the click point.

Implementation guidance for future code work:

- Capture click coordinates.
- Store the requested next theme.
- Render the new theme through a transition layer.
- Animate expanding circular or wave masks from the click point.
- Commit the new theme as active after the reveal completes.
- Respect `prefers-reduced-motion`.

## Styling Rules

- Prefer existing project styling patterns.
- Use theme tokens rather than literal color values in components.
- Keep text contrast accessible.
- Keep nav, hero, collection strip, and product cards visibly aligned with the active theme.
- Avoid one-off component overrides that break theme consistency.

## Content Rules

Woven targets a general audience.

Use copy that feels inclusive and product-focused. Do not use institution-specific, eligibility-based, or age-specific positioning.

Removed concepts:

- legacy narrow-audience program
- eligibility-only offer
- institution-based verification
- audience-specific promotional flow

## Logo Rules

The existing `agents/logos-for-design/` material belongs to Classic. It should not be treated as the global logo source for every theme.

Future logo organization should support:

```text
public/logos/classic/
public/logos/summer/
public/logos/winter/
```

Summer and Winter logo references are pending user input.

## Asset Rules

Theme media should be grouped by theme:

```text
public/videos/themes/summer/
public/videos/themes/winter/
public/images/themes/classic/
public/images/themes/summer/
public/images/themes/winter/
```

Hero videos must be optimized for web playback and must not block the page from becoming usable.

## Accessibility Rules

- Maintain keyboard access for the theme switcher.
- Show visible focus states.
- Provide reduced-motion behavior for ripple transitions.
- Ensure hero text remains readable over videos.
- Avoid relying on color alone to show selected theme.

## Testing Guidance For Future Implementation

When code is implemented later, verify:

- Theme switcher changes all theme-controlled areas.
- Ripple origin matches the click point.
- Classic stays visually unchanged unless intentionally edited.
- Summer uses black navbar, black collection strip, sky-blue accents, and black text.
- Winter uses ice-white navbar, ice-white collection strip, and a cool winter palette.
- Theme-specific Collections display correctly.
- No removed audience-specific language appears in UI or metadata.
