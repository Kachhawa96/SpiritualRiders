# ARCHITECTURE.md — Spiritual Riders

## Overview

Spiritual Riders is a Next.js 16 App Router application following a server-first, component-driven architecture optimized for performance, luxury visual fidelity, SEO, and enterprise security.

---

## Architecture Principles

1. **Server Components by default** — Client Components are isolated islands used exclusively for interactivity, animation, and client-side media optimization.
2. **Clean data-access layer** — Direct database queries are never scattered in components; they reside exclusively in `src/lib/db/`.
3. **Strict TypeScript & Zod validation** — Strict compiler checks (`noImplicitAny`, `noUnusedLocals`) paired with runtime Zod parsing on all external data boundaries.
4. **Privacy & Security by design** — Privacy flags are enforced at the database view level (`rider_public`) and server-side before reaching any component.
5. **Fail-Safe Media Processing** — Client-side image compression and format conversion prevent serverless payload crashes and execution timeouts.
6. **Mobile-first luxury design** — High-end responsive layouts with touch-safe hover isolation and zero-shift typography.

---

## Technology Decisions

### Next.js 16 App Router (Turbopack, React 19)
- Server Components eliminate client JavaScript overhead for static pages.
- Native Server Actions handle form submissions and mutations with built-in CSRF protection.
- Dynamic `[slug]` routes leverage `generateStaticParams` for SSG where appropriate.
- Turbopack provides fast compilation and instant hot-module replacement.

### Tailwind CSS v4
- Modern CSS-first architecture utilizing `@theme inline`.
- Custom design tokens with native `oklch()` color definitions (Obsidian, Charcoal, Graphite, Ivory, and Metallic Gold).
- Responsive container primitives and `@media (hover: hover)` rules preventing sticky touch states.

### Supabase (PostgreSQL + RLS + Storage)
- **Base Tables**: Protected with Row Level Security. Direct mutations require authenticated admin sessions.
- **Public Views with RLS**: `rider_public`, `ride_public`, `gallery_public`, and `ride_participant_public` have dedicated RLS policies allowing `SELECT` access to `anon` and `authenticated` roles while shielding private columns (age, blood group, city, contact info).
- **Onboarding Staging**: The `public.rider_profile_submissions` table acts as an append-only quarantine area. Live roster data (`public.riders`) is only modified after explicit admin approval.
- **Supabase Storage**: Centralized media bucket `rider-media` housing portraits, bikes, covers, and gallery assets.

### Client-Side Image Compression & iPhone (HEIC) Pipeline
- **Problem Solved**: Vercel and serverless edge gateways reject HTTP request payloads larger than 4.5 MB (`HTTP 413 Payload Too Large`), crashing client browsers on multi-photo form submissions.
- **Automatic Compression (`src/lib/image-compression.ts`)**: Camera photos (5–12 MB) are compressed client-side to ~800 KB – 1.2 MB at 1920px Full HD before network transmission.
- **Dual-Layer iPhone (HEIC) Conversion**:
  - *Layer 1 (Native Apple Safari)*: Hardware-accelerated canvas transcoding from HEIC to JPEG.
  - *Layer 2 (Universal WebAssembly)*: `heic2any` fallback for Chrome/Edge/Firefox users uploading transferred Apple files.
- **Parallel Server Uploads**: Converted sequential storage uploads into concurrent `Promise.all` tasks in Server Actions, avoiding serverless function timeouts.

---

## Folder Structure

```
spiritual-riders/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, metadata, shell)
│   │   ├── page.tsx                  # Homepage (Hero with video/image fallback)
│   │   ├── globals.css               # Design tokens + global CSS
│   │   ├── about/page.tsx            # Community story and machines
│   │   ├── riders/                   # Public rider directory
│   │   │   ├── page.tsx              # Searchable/filterable directory
│   │   │   └── [slug]/page.tsx       # Individual rider profile
│   │   ├── rides/                    # Rides listing & status filters
│   │   │   ├── page.tsx              # Browse rides with status badges
│   │   │   └── [slug]/page.tsx       # Ride detail, route, and telemetry
│   │   ├── gallery/page.tsx          # Masonry gallery & lightbox
│   │   ├── contact/page.tsx          # Public contact form
│   │   ├── onboard/                  # Rider profile onboarding portal
│   │   │   ├── page.tsx              # Public onboarding submission form
│   │   │   └── actions.ts            # Rate-limited onboarding server actions
│   │   ├── join/page.tsx             # Alias redirecting to /onboard
│   │   └── admin/                    # Authenticated management console
│   │       ├── (dashboard)/
│   │       │   ├── page.tsx          # Admin overview & metrics
│   │       │   ├── riders/           # Rider CRUD management
│   │       │   ├── rides/            # Ride CRUD management
│   │       │   ├── gallery/          # Gallery asset management
│   │       │   ├── onboarding/       # Submissions review & approval
│   │       │   ├── messages/         # Contact inquiries
│   │       │   └── settings/         # Hero video & community toggles
│   │       └── login/page.tsx        # Admin login
│   │
│   ├── components/
│   │   ├── ui/                       # Primitive components (Button, Card, DatePicker, Modals)
│   │   ├── layout/                   # Header, MobileNav, Footer, AppShell
│   │   ├── motion/                   # Reveal, PageTransition, AnimatedText
│   │   ├── sections/                 # Homepage and About page sections
│   │   ├── riders/                   # Rider cards, filters, and search
│   │   ├── rides/                    # Ride cards with auto-status badges
│   │   ├── gallery/                  # Gallery browser and lightbox
│   │   ├── onboarding/               # OnboardingClient form and image cards
│   │   └── admin/                    # AdminNav, RiderForm, SettingsForm, modals
│   │
│   ├── config/
│   │   └── site.ts                   # Navigation, constants, site configuration
│   ├── lib/
│   │   ├── auth/                     # Server-side admin auth guards
│   │   ├── db/                       # Supabase data-access layer
│   │   │   ├── client.ts             # Anon and admin client factories
│   │   │   ├── riders.ts             # Public rider queries
│   │   │   ├── rides.ts              # Public ride queries
│   │   │   ├── gallery.ts            # Public gallery queries
│   │   │   ├── admin.ts              # Admin CRUD operations
│   │   │   └── onboarding.ts         # Onboarding submission DAL
│   │   ├── image-compression.ts      # Client-side compression & HEIC converter
│   │   ├── security/rate-limiter.ts  # In-memory sliding-window IP rate limiter
│   │   └── utils.ts                  # Date utilities, slugification, cn helper
│   └── types/                        # TypeScript type definitions
│
├── supabase/
│   └── migrations/                   # PostgreSQL DDL migrations and seed scripts
├── public/                           # Static public assets
└── next.config.ts                    # Next.js configuration
```

---

## Data Flow & Mutation Pipeline

```
Public User
  │
  ├──► [Client Browser]
  │      ├─ Compresses photos to ~800KB–1.2MB (browser-image-compression)
  │      ├─ Converts iPhone HEIC/HEIF to JPEG (Canvas / heic2any)
  │      └─ Validates payload < 4.2MB to avoid 413 edge drop
  │
  ├──► [Next.js Server Action] (`src/app/onboard/actions.ts`)
  │      ├─ Enforces IP rate limiting (10 req/min)
  │      ├─ Checks bot honeypot trap
  │      ├─ Validates 5MB server limit
  │      └─ Uploads photos in parallel via Promise.all
  │
  └──► [Supabase Database]
         ├─ Writes to staging table: `public.rider_profile_submissions`
         └─ (Live `public.riders` roster is untouched until Admin approval)

Admin Approval Workflow
  │
  ├──► Admin logs in at `/admin/login` (Supabase Auth session cookie)
  ├──► Reviews diff at `/admin/onboarding/[id]`
  └──► Clicks "Approve" -> Server Action updates `public.riders`
```

---

## Routing Table

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Cinematic homepage with configurable hero video/image |
| `/about` | Public | Community story, brotherhood philosophy, and machine lineup |
| `/riders` | Public | Searchable, filterable rider roster |
| `/riders/[slug]` | Public | Individual rider story, bike telemetry, and gallery |
| `/rides` | Public | Community rides with auto-status badges (`UPCOMING`, `ONGOING`, `COMPLETED`) |
| `/rides/[slug]` | Public | Detailed ride itinerary and participant roster |
| `/gallery` | Public | Community photo gallery with responsive lightbox |
| `/contact` | Public | Public inquiry form |
| `/onboard` | Public | Hardened rider onboarding and profile update portal |
| `/join` | Public | Shortcut redirecting to `/onboard` |
| `/admin` | Protected | Admin overview and club statistics |
| `/admin/riders` | Protected | Rider roster management (create, edit, archive) |
| `/admin/rides` | Protected | Ride planning and itinerary manager |
| `/admin/gallery` | Protected | Gallery upload and media tagging |
| `/admin/onboarding` | Protected | Rider application review, comparison diffs, and approval |
| `/admin/settings` | Protected | Community feature toggles and Hero video management |
| `/admin/messages` | Protected | Contact inbox review |
