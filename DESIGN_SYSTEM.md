# DESIGN_SYSTEM.md — Spiritual Riders

## Design Philosophy

The Spiritual Riders visual identity is inspired by:
- Premium motorcycle brands (luxury, engineering precision)
- Cinematic editorial photography
- High-end automotive websites
- Premium lifestyle and streetwear branding
- Sophisticated dark-mode interfaces

**The experience must feel**: Cinematic. Luxurious. Masculine but elegant. Fast. Emotionally engaging.

**Must NOT feel like**: A generic business site, a boring directory, a marketplace template,
or a page filled with unnecessary gradients and random animations.

---

## Color System

All colors are defined as CSS variables in `src/app/globals.css` using Tailwind v4 `@theme inline`.
Colors use the `oklch()` color space for perceptually uniform palettes.

### Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-obsidian-950` | `oklch(6% 0.008 270)` | Page background |
| `--color-obsidian-900` | `oklch(10% 0.01 270)` | Surface (cards, panels) |
| `--color-obsidian-800` | `oklch(14% 0.012 270)` | Raised surface |
| `--color-charcoal-700` | `oklch(20% 0.01 265)` | Subtle border |
| `--color-charcoal-600` | `oklch(26% 0.01 265)` | Default border |
| `--color-charcoal-500` | `oklch(32% 0.01 265)` | Strong border |
| `--color-graphite-400` | `oklch(42% 0.008 260)` | Subtle text |
| `--color-graphite-300` | `oklch(52% 0.006 260)` | Muted text |
| `--color-graphite-200` | `oklch(65% 0.005 260)` | Secondary text |
| `--color-ivory-100` | `oklch(96% 0.01 90)` | Primary text |
| `--color-gold-500` | `oklch(67% 0.14 75)` | Primary accent |
| `--color-gold-400` | `oklch(75% 0.13 80)` | Lighter accent |
| `--color-bronze-500` | `oklch(60% 0.11 62)` | Warm accent |

### Semantic Aliases

| Token | Points To | Meaning |
|-------|-----------|---------|
| `--color-background` | obsidian-950 | Page background |
| `--color-surface` | obsidian-900 | Card/panel background |
| `--color-surface-raised` | obsidian-800 | Elevated surface |
| `--color-border` | charcoal-600 | Standard border |
| `--color-border-subtle` | charcoal-700 | Subtle separator |
| `--color-foreground` | ivory-100 | Primary text |
| `--color-foreground-muted` | graphite-300 | Secondary text |
| `--color-foreground-subtle` | graphite-400 | Placeholder/hint |
| `--color-accent` | gold-500 | Call-to-action, highlights |
| `--color-accent-muted` | gold-300 | Soft accent |
| `--color-accent-dim` | bronze-600 | Warm accent variant |

### Usage Ratio
- ~70% dark neutrals (obsidian, charcoal)
- ~20% light neutrals (graphite, ivory)
- ~10% accent/metallic (gold, bronze)

**Never use gold everywhere** — it must feel selective and premium.

---

## Typography

### Typefaces

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Cormorant Garamond | 300, 400, 500, 600, 700 | Headlines, hero text, editorial |
| Body | Inter | 300, 400, 500, 600, 700 | UI, body copy, navigation, labels |

**Variable**: `--font-display` and `--font-sans`

### Scale

Headings use `clamp()` for fluid responsive sizing:

| Element | Range |
|---------|-------|
| `h1` | clamp(2.5rem, 6vw, 5rem) |
| `h2` | clamp(2rem, 4.5vw, 3.75rem) |
| `h3` | clamp(1.5rem, 3vw, 2.25rem) |
| `h4` | clamp(1.25rem, 2vw, 1.875rem) |

### Hierarchy Rules
- Strong hierarchy via **type**, not decoration.
- Display font for editorial impact.
- Inter for clarity at small sizes.
- `letter-spacing: -0.02em` on headings for modern premium feel.
- `line-height: 1.15` on headings, `1.6` on body.

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-section` | 6rem | Section padding (desktop) |
| `--spacing-section-sm` | 4rem | Section padding (mobile) |

Spacing uses Tailwind's default scale for component-level spacing.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem | Small UI elements |
| `--radius-md` | 0.5rem | Inputs, badges |
| `--radius-lg` | 0.75rem | Cards |
| `--radius-xl` | 1rem | Large cards |
| `--radius-2xl` | 1.5rem | Modal, sheets |
| `--radius-full` | 9999px | Pills, avatars |

---

## Motion System

### Philosophy
Animation must support the brand: atmosphere, depth, hierarchy, movement, premium feel.
Must NOT create motion sickness, slow loading, visual chaos, or distracting interactions.
**Always respect `prefers-reduced-motion`.**

**Decision (2026-10-03)**: NO dedicated animated splash screen or full-screen intro sequence.
Reason: conflicts with LCP, accessibility, and the "fast / production-ready" mandate.
Cinematic first impression is delivered by the **Hero entrance animation only**.

### Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover states, micro-feedback |
| `--duration-normal` | 300ms | Standard transitions |
| `--duration-slow` | 500ms | Complex component transitions |
| `--duration-slower` | 800ms | Section entrances |
| `--duration-cinematic` | 1200ms | Hero, full-page transitions |

### Easing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) | Entrances |
| `--ease-in-out-expo` | cubic-bezier(0.87, 0, 0.13, 1) | Page transitions |
| `--ease-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Interactive hover |

### Animation Patterns (Phase 1+)

- **Fade-up reveal** — y: 30px opacity: 0 → y: 0 opacity: 1
- **Image reveal mask** — clip-path horizontal wipe
- **Staggered text** — character or line stagger
- **Parallax** — subtle depth on scroll (slow factor)
- **Card hover** — subtle scale + border glow
- **Page transition** — smooth opacity + y shift

---

## Utility Classes

| Class | Description |
|-------|-------------|
| `.container-site` | Max-width 1400px, centered, responsive padding |
| `.container-narrow` | Max-width 900px, centered |
| `.section-padding` | 6rem block padding |
| `.section-padding-sm` | 4rem block padding |
| `.text-accent` | Gold accent color |
| `.text-muted` | Muted foreground color |
| `.font-display` | Cormorant Garamond override |
| `.text-gradient-gold` | Metallic gold gradient text (use sparingly) |
| `.divider` | 1px neutral separator |
| `.divider-gold` | 1px gold gradient separator |
| `.sr-only` | Visually hidden (screen readers only) |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-glow-gold` | `0 0 40px oklch(67% 0.14 75 / 0.15)` | Card hover glow (Phase 1+) |
| `--shadow-card` | `0 4px 24px oklch(6% ... / 0.5)` | Default card shadow |
| `--shadow-card-hover` | `0 8px 48px oklch(6% ... / 0.7)` | Card hover shadow |

---

## Brand Language

**Use**: Riders, Brotherhood, The Crew, Our Journey, The Spirit, Machines, Ride Stories, Community, Chapter, Rides, Memories.

**Avoid on public site**: Users, Customers, Employees, Members (too corporate).
