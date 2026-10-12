# Spiritual Riders

> **Riders. Brotherhood. Spirit.**

A premium motorcycle community web application built with Next.js 16 (App Router, Turbopack), TypeScript, and Tailwind CSS v4.

---

## What is Spiritual Riders?

Spiritual Riders is a luxury biker brotherhood — a community of passionate motorcyclists united by the spirit of the ride. This web application is their digital home: showcasing riders, machines, community rides, an interactive gallery, and a hardened rider onboarding portal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first, `@theme inline`, OKLCH palette) |
| Animation | Motion (`motion` / `motion/react`) |
| Image Pipeline | `browser-image-compression` + `heic2any` (iPhone HEIC/HEIF support) |
| Database | Supabase (PostgreSQL with Row Level Security on views) |
| Auth | Supabase Auth (server-side session verification) |
| Storage | Supabase Storage (`rider-media` bucket) |
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
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Next.js production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check (`tsc --noEmit`) |
| `npm run format` | Run Prettier code formatting |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages, layouts, and server actions
│   ├── layout.tsx        # Root layout (fonts, metadata, shell)
│   ├── page.tsx          # Cinematic Homepage (Hero with video/image fallback)
│   ├── about/            # Community story and machine showcase
│   ├── riders/           # Public rider directory and [slug] profiles
│   ├── rides/            # Rides listing with status badges and [slug] details
│   ├── gallery/          # Community photo gallery with lightbox
│   ├── contact/          # Community contact form
│   ├── onboard/          # Hardened rider profile onboarding portal
│   ├── join/             # Alias redirect to /onboard
│   └── admin/            # Authenticated admin dashboard (CMS, settings, approvals)
├── components/
│   ├── ui/               # Button, Card, Container, SectionHeading, ErrorModal, DatePicker
│   ├── layout/           # Header, MobileNav, Footer, AppShell
│   ├── motion/           # Reveal, AnimatedText, PageTransition (reduced-motion safe)
│   ├── sections/         # Homepage and About page sections
│   ├── riders/           # Rider cards, directory filters, and search
│   ├── rides/            # Ride cards with auto-status badges, browser filters
│   ├── gallery/          # Gallery masonry browser and lightbox
│   ├── onboarding/       # Onboarding form, image compression, validation modals
│   └── admin/            # Admin forms, tables, modals, and management controls
├── config/
│   └── site.ts           # Site-wide constants, live routes, navigation
├── lib/                  # Shared utilities, auth, database client, image compression
│   ├── db/               # Supabase DAL (public views, admin mutations, onboarding)
│   ├── auth/             # Server-side admin authentication guards
│   ├── image-compression.ts # Client compression, 5MB validation & iPhone HEIC converter
│   └── utils.ts          # Date calculation, slugify, cn
└── types/                # TypeScript type definitions (rider, ride, gallery, admin)
```

## Development Phases

| Phase | Name | Status |
|-------|------|--------|
| 0 | Foundation | Complete |
| 1 | Visual Identity + Global Shell | Complete |
| 2 | Homepage Experience | Complete |
| 3 | About + Community Story | Complete |
| 4 | Rider Directory | Complete |
| 5 | Rider Profile | Complete |
| 6 | Database + Real Content | Complete |
| 7 | Rides + Events + Gallery | Complete |
| 8 | Admin / Content Management | Complete |
| 9 | Polish / Cinematic Motion | Complete |
| — | Hardening, Hero Video & HEIC Onboarding | Complete |
| 10 | SEO / Accessibility / Performance | Next Up |
| 11 | Testing (Vitest + Playwright) | Pending |
| 12 | Production Release | Pending |

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture, data flow, and design decisions
- [CURRENT_STATUS.md](./CURRENT_STATUS.md) — Real-time development progress and phase logs
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Luxury Obsidian & Gold design tokens, typography, motion
- [DEVELOPMENT.md](./DEVELOPMENT.md) — Coding conventions, TypeScript rules, and git workflow
- [ONBOARDING.md](./ONBOARDING.md) — Rider profile onboarding architecture and image pipeline

---

*Built with passion for the Spiritual Riders brotherhood.*
