# ARCHITECTURE.md — Spiritual Riders

## Overview

Spiritual Riders is a Next.js 15 App Router application following a server-first,
component-driven architecture optimized for performance, SEO, and scalability.

---

## Architecture Principles

1. **Server Components by default** — Client Components only when interactivity requires it.
2. **Clean data-access layer** — Supabase calls never scattered in components; always in `src/lib/db/`.
3. **Strict TypeScript** — No implicit any, no unused variables.
4. **Privacy by design** — Privacy flags enforced server-side before data reaches any component.
5. **Mobile-first** — All layouts designed for mobile, progressively enhanced.

---

## Technology Decisions

### Why Next.js 15 App Router?
- Server Components reduce JS bundle size significantly.
- Built-in image optimization (responsive, WebP/AVIF, lazy).
- File-system routing with dynamic `[slug]` pages.
- Streaming and Suspense for progressive page loading.
- Built-in SEO metadata API.

### Why Tailwind CSS v4?
- CSS-first configuration (no `tailwind.config.js`).
- `@theme inline` for design token integration with CSS variables.
- Better CSS cascade, smaller output.
- Native oklch() colors for perceptually uniform palettes.

### Why Supabase? (Phase 6+)
- PostgreSQL with Row Level Security (RLS).
- Built-in Auth with social providers.
- Storage for community images.
- Real-time capabilities for future features.
- TypeScript SDK with strong typing.

### Why Motion (Framer Motion)? (Phase 1)
- Package: `motion` (v14), imported from `motion/react`.
- Production-tested animation library with a small client boundary.
- `MotionConfig reducedMotion="user"` lives on the shell.
- Server Components stay the default. Client islands: header, mobile menu, reveal, text, image wipe, page enter.

### Global shell (Phase 1)
- `AppShell` composes the sticky header, mobile dialog, main, and footer. The footer is passed in from the server layout.
- Desktop navigation starts at `1024px`. Below that, a full-screen menu traps focus, locks scroll, and closes on Escape, route change, or resize.
- Page enter uses `src/app/template.tsx`. It is a short vertical settle with opacity held at 1 so the first paint is not blank. There is no exit animation and no splash screen.
- Unbuilt routes stay in the nav. `LIVE_ROUTES` in `src/config/site.ts` is the prefetch allow-list. Add a path when that phase ships. Unknown URLs render the branded `not-found` page inside the shell.
- Reduced motion is enforced in CSS on `[data-motion-reveal]` so it does not depend on a hydration-sensitive hook. Motion still skips positional transforms when the OS preference is set.
- Global element styles (headings, paragraphs, links) live in `@layer base`. An unlayered `* { margin: 0 }` would override Tailwind spacing utilities. Do not add unlayered resets that fight utilities.

### Homepage (Phase 2)
- The ten homepage sections live in `src/components/sections/home/`.
- Fictional copy and figures live in `src/data/home.ts`. City is omitted when `showCity` is false. Age, blood group, and social links are not on this page.
- `/`, `/about`, and `/riders` are live. Individual rider pages are generated from the crew list. Ride and gallery links stay off `LIVE_ROUTES` until those pages exist.
- Stats count up when they enter view. Reduced motion shows the final number immediately.

---

## Folder Structure

```
spiritual-riders/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Design tokens + global CSS
│   │   ├── about/
│   │   │   └── page.tsx        # Phase 3
│   │   ├── riders/
│   │   │   ├── page.tsx        # Phase 4 — rider directory
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Phase 5 — rider profile
│   │   ├── rides/
│   │   │   ├── page.tsx        # Phase 7 — rides listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Phase 7 — ride detail
│   │   ├── gallery/
│   │   │   └── page.tsx        # Phase 7 — gallery
│   │   ├── contact/
│   │   │   └── page.tsx        # Phase 7 — contact
│   │   └── admin/
│   │       └── ...             # Phase 8 — protected admin
│   │
│   ├── components/
│   │   ├── ui/                 # Primitive components
│   │   │   ├── Container.tsx   # Responsive layout wrapper
│   │   │   ├── Button.tsx      # Phase 1
│   │   │   └── ...
│   │   ├── layout/             # Global layout components
│   │   │   ├── Header.tsx      # Phase 1
│   │   │   ├── Footer.tsx      # Phase 1
│   │   │   └── Navigation.tsx  # Phase 1
│   │   ├── sections/           # Page section components
│   │   │   ├── home/           # Phase 2
│   │   │   ├── about/          # Phase 3
│   │   │   └── riders/         # Phase 4-5
│   │   └── common/             # Shared composites
│   │
│   ├── config/
│   │   └── site.ts             # Navigation, routes, constants
│   │
│   ├── data/                   # Mock/seed data (Phases 0-5)
│   │   └── mock-riders.ts      # Fictional rider data (Phase 4)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── (Phase 1+)
│   │
│   ├── lib/                    # Shared logic
│   │   ├── utils.ts            # General utilities
│   │   ├── accessibility.ts    # A11y hooks and helpers
│   │   └── db/                 # Supabase data-access layer (Phase 6+)
│   │       ├── riders.ts
│   │       ├── rides.ts
│   │       └── gallery.ts
│   │
│   ├── styles/                 # Additional CSS modules (if needed)
│   │
│   └── types/                  # TypeScript definitions
│       ├── index.ts            # Shared primitives
│       ├── rider.ts            # Rider model
│       └── ride.ts             # Ride/Event model
│
├── public/                     # Static assets
│   └── images/                 # Placeholder images
│
├── .env.example                # Environment variable template
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript (strict)
├── eslint.config.mjs           # ESLint configuration
└── postcss.config.mjs          # PostCSS (Tailwind v4)
```

---

## Data Flow

```
Browser
  └── Next.js Route (App Router)
        ├── Server Component (default)
        │   ├── Fetch from Supabase via data-access layer (Phase 6+)
        │   │   └── Privacy flags applied BEFORE returning data
        │   └── Render HTML with data
        │
        └── Client Component (when interactivity needed)
            ├── Receives data as props from Server Component
            └── Handles UI state, animations, user interactions
```

---

## Security Architecture

- **No service-role key in browser** — ever.
- **RLS enforced** at database level (Phase 6+).
- **Privacy flags** applied server-side before API responses.
- **Admin routes** protected by Supabase Auth server-side (Phase 8+).
- **Environment variables** — all secrets in `.env.local`, never committed.
- **Input validation** — Zod schemas on all form inputs (Phase 6+).

---

## Performance Strategy

- Server Components = zero client JS by default.
- `next/image` for all images — responsive, lazy, WebP/AVIF.
- Turbopack for fast dev builds.
- Font optimization via `next/font/google` (no layout shift).
- CSS design tokens — no runtime style calculations.
- Animation — client-only, respects `prefers-reduced-motion`.

---

## Routing Table

| Route | Phase | Description |
|-------|-------|-------------|
| `/` | 2 | Cinematic homepage |
| `/about` | 3 | Community story |
| `/riders` | 4 | Rider directory |
| `/riders/[slug]` | 5 | Individual rider profile |
| `/rides` | 7 | Community rides |
| `/rides/[slug]` | 7 | Ride detail |
| `/gallery` | 7 | Community gallery |
| `/contact` | 7 | Contact / join request |
| `/admin` | 8 | Protected admin (auth required) |
