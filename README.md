# Spiritual Riders

> **Riders. Brotherhood. Spirit.**

A premium motorcycle community web application built with Next.js 15, TypeScript, and Tailwind CSS v4.

---

## What is Spiritual Riders?

Spiritual Riders is a luxury biker brotherhood — a community of passionate motorcyclists united by the spirit of the ride. This web application is their digital home: showcasing riders, machines, community rides, and the collective story of the brotherhood.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first, `@theme inline`) |
| Animation | Motion (`motion` / `motion/react`) |
| Database | Supabase (PostgreSQL) — Phase 6+ |
| Auth | Supabase Auth — Phase 8+ |
| Storage | Supabase Storage — Phase 6+ |
| Hosting | Vercel |
| Testing | Vitest + Playwright — Phase 11 |

## Getting Started

```bash
# Clone and install
npm install

# Set up environment
cp .env.example .env.local
# Fill in values in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── layout.tsx        # Root layout (fonts, metadata, shell)
│   ├── template.tsx      # Page-enter transition
│   ├── page.tsx          # Temporary brand shell (Phase 2 replaces it)
│   ├── not-found.tsx     # Branded missing-route page
│   └── globals.css       # Design tokens + global styles
├── components/
│   ├── ui/               # Button, Card, Container, SectionHeading
│   ├── layout/           # Header, mobile menu, footer, shell
│   ├── motion/           # Reveal, AnimatedText, ImageReveal, page enter
│   └── sections/         # Page section components (Phase 2+)
├── config/
│   └── site.ts           # Site-wide constants and navigation
├── data/                 # Mock data (replaced by Supabase in Phase 6)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
│   ├── utils.ts          # General utilities (cn, slugify, dates, etc.)
│   └── accessibility.ts  # A11y hooks and helpers
├── styles/               # Additional style utilities (if needed)
└── types/                # TypeScript type definitions
    ├── index.ts          # Shared base types
    ├── rider.ts          # Rider data model
    └── ride.ts           # Ride/Event data model
```

## Development Phases

| Phase | Name | Status |
|-------|------|--------|
| 0 | Foundation | Complete |
| 1 | Visual Identity + Global Shell | Complete |
| 2 | Homepage Experience | Pending |
| 3 | About + Community Story | Pending |
| 4 | Rider Directory | Pending |
| 5 | Rider Profile | Pending |
| 6 | Database + Real Content | Pending |
| 7 | Rides + Events + Gallery | Pending |
| 8 | Admin / Content Management | Pending |
| 9 | Polish / Cinematic Motion | Pending |
| 10 | SEO / Accessibility / Performance | Pending |
| 11 | Testing | Pending |
| 12 | Production Release | Pending |

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture and design decisions
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Design tokens, colors, typography, motion
- [DEVELOPMENT.md](./DEVELOPMENT.md) — Development workflow and guidelines

---

*Built with passion for the Spiritual Riders brotherhood.*
