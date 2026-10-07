# SPIRITUAL RIDERS — COMPLETE MASTER DEVELOPMENT PROMPT
### Optimized for Claude Code (Phase-by-Phase Implementation)

**Version**: 2026-10  
**Status**: Ready for Phase 0  
**Stack (latest stable)**: Next.js 15 (App Router + React 19 + Turbopack), TypeScript strict, Tailwind CSS v4, Motion (Framer Motion), shadcn/ui, Supabase, Vercel, Playwright + Vitest.

---

## HOW TO USE THIS FILE WITH CLAUDE CODE

1. Copy this entire file into Claude Code as the primary instruction / system prompt.
2. Start with:  
   `Implement PHASE 0 only. Follow the exact reporting format at the end of every phase. STOP after Phase 0.`
3. After each phase finishes and you approve, say:  
   `Continue to Phase X` (replace X with the next number).
4. Never let Claude implement more than one phase at a time.
5. After every phase Claude must run: `npm run lint && npm run typecheck && npm run build` (and any phase-specific tests) and report results.
6. Claude must use the exact reporting template shown at the bottom of this document.

---

## 1. PROJECT VISION

Build a premium web application called **Spiritual Riders** from scratch.

The website represents a luxury riders community / biker brotherhood and should feel like a premium motorcycle brand combined with a modern community portfolio.

**Final experience must feel**:
- Premium
- Cinematic
- Luxurious
- Modern
- Masculine but elegant
- Emotionally engaging
- Fast
- Responsive
- Highly interactive
- Visually memorable
- Technically scalable
- SEO-friendly
- Accessible
- Production-ready

**Immediately communicate**:
Riders. Brotherhood. Spirit.

**Public website must showcase**:
- The Spiritual Riders community
- Community story & values
- Community statistics
- Members/riders
- Each rider’s motorcycle
- Rider profile information (position/role, blood group, age, bio, achievements, riding interests)
- Events / rides
- Gallery
- Community identity
- Contact / join-community CTA

**Central visual experience**: people + motorcycles + movement + brotherhood.

**Must NOT feel like**:
- A generic business website
- A boring directory
- A conventional admin dashboard
- A marketplace template
- A page filled with unnecessary gradients and random animations

---

## 2. DEVELOPMENT PHILOSOPHY (NON-NEGOTIABLE)

1. **Build incrementally** — one phase at a time. Complete → verify → document → STOP.
2. **Never silently make major architectural decisions** — document database, auth, storage, deployment, routing, animation, security, third-party choices.
3. **Production quality from day one** — TypeScript strict, reusable components, clean architecture, env vars, validation, error handling, responsive, accessible, scalable data structures.
4. **Avoid overengineering** — every dependency must have a practical purpose.
5. **Mobile is first-class** — design for mobile, tablet, laptop, desktop, large screens simultaneously.
6. **Animation must support the brand** — atmosphere, depth, hierarchy, movement, premium feel.  
   Must NOT create motion sickness, slow loading, visual chaos, or distracting interactions.  
   Always respect `prefers-reduced-motion`.

---

## 3. RECOMMENDED TECHNOLOGY STACK (2025–2026)

**Frontend**
- Next.js 15 (App Router, React 19, Turbopack)
- TypeScript (strict)
- Tailwind CSS v4 + CSS variables / design tokens
- shadcn/ui (latest)
- Motion (formerly Framer Motion) for UI animation
- GSAP only where complex cinematic scroll animations genuinely justify it

**Backend / Data**
- Supabase (PostgreSQL + Storage + Auth)
- Clean data-access layer (never scatter Supabase calls in components)
- Zod for validation

**Hosting**
- Vercel

**Images**
- Next.js Image (responsive sizes, modern formats, lazy loading)
- Supabase Storage or Cloudinary for community imagery

**Testing**
- Playwright (e2e critical paths)
- Vitest (unit/component)
- ESLint + TypeScript strict

**Code Quality**
- Strict TypeScript
- Reusable components
- Typed data models
- Schema validation
- Meaningful naming
- No dead code
- No unnecessary abstractions

---

## 4. VISUAL DIRECTION

Inspired by premium motorcycle brands, luxury automotive sites, cinematic photography, high-end editorial magazines, premium lifestyle & streetwear branding, sophisticated dark-mode interfaces.

**Original design language** — do not copy any existing site.

### Color Direction
- Obsidian / near-black
- Charcoal
- Graphite
- Warm ivory
- Metallic gold / muted bronze (used carefully — never “gold everywhere”)
- Soft neutral gray

Guideline ratio: ~70% dark neutrals / 20% light neutrals / 10% accent/metallic.

### Typography
- Distinctive editorial / luxury display typeface
- Highly readable modern sans-serif for body
- Strong hierarchy via type, not decoration

### Brand Language
Use: Riders, Brotherhood, The Crew, Our Journey, The Spirit, Machines, Ride Stories, Community, Chapter, Rides, Memories.  
Avoid corporate words (Users, Customers, Employees) on the public site.

---

## 5. CORE INFORMATION ARCHITECTURE

**Public routes**
- `/` — Homepage
- `/about` — About Spiritual Riders
- `/riders` — Rider directory
- `/riders/[slug]` — Individual rider profile
- `/rides` — Community rides/events
- `/rides/[slug]` — Individual ride/event
- `/gallery` — Community photography
- `/contact` — Contact / join request

**Future (do not implement until designated phase)**
- `/join`
- `/admin`

---

## 6. HOMEPAGE EXPERIENCE (Phase 2)

Cinematic, full-viewport Hero → Community Intro → Animated Stats → Featured Riders → Brotherhood/Values → Featured Bikes → Timeline → Ride Highlight → Gallery Preview → Final CTA.

Hero messaging direction (examples only — improve if better copy emerges):
- “Ride Beyond Roads.”
- “More Than Riders. One Spirit.”

---

## 7. RIDER DATA MODEL (key fields)

```ts
id, slug, full_name, display_name, profile_image, cover_image,
age, blood_group, community_position, bio, short_bio,
bike_brand, bike_model, bike_variant, bike_year, bike_color, bike_image,
city, joined_date,
favorite_route, riding_since, riding_style,
instagram_url, facebook_url, youtube_url, website_url,
is_featured, is_active,
show_age, show_blood_group, show_city, show_social_links,  // privacy flags
created_at, updated_at
```

Never store Aadhaar, PAN, phone, home address, emergency contacts unless explicitly required later.

---

## 8. ANIMATION SYSTEM

Consistent system: page transitions, fade-up reveals, image reveal masks, smooth navigation, subtle parallax, section entrances, refined hover states.

**Hero**: background scale, text stagger, image reveal, ambient movement, scroll-linked transitions.

**Rider cards**: image scale, restrained 3D tilt, metadata reveal, glow/border.

**Explicit decision (2026-10-03)**:  
**NO dedicated animated splash screen or full-screen intro sequence.**  
Reason: conflicts with performance (LCP), accessibility (`prefers-reduced-motion`), and the “fast / production-ready” mandate.  
Cinematic first impression is delivered by the Hero entrance animation only.

---

## 9. PHASE-WISE IMPLEMENTATION PLAN

### PHASE 0 — PRODUCT & ARCHITECTURE FOUNDATION
**Goal**: Runnable, linted, type-checked, documented foundation.

Tasks:
1. Initialize Next.js 15 (TypeScript, App Router, Tailwind v4, ESLint, src/).
2. Strict TypeScript + path aliases.
3. Design tokens (colors, spacing, radius, typography, motion).
4. Base layout, global CSS, responsive Container.
5. Accessibility primitives + `prefers-reduced-motion`.
6. Folder structure, `.env.example`, documentation (`README.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DEVELOPMENT.md`).
7. Verify: `npm run dev`, `build`, `lint`, `typecheck` all succeed.

**Commit**: `phase-0-foundation`  
**STOP.**

---

### PHASE 1 — VISUAL IDENTITY + GLOBAL SHELL
**Goal**: Brand-recognizable shell that already feels premium.

Implement: brand colors/typography, Button variants, cards, SectionHeading, Container, Reveal, AnimatedText, ImageReveal, desktop + mobile navigation, footer, global page-transition + motion system, temporary homepage shell.

**Commit**: `phase-1-brand-shell`  
**STOP.**

---

### PHASE 2 — HOMEPAGE EXPERIENCE
**Goal**: Cinematic, production-feeling homepage with realistic mock data.

Implement all 10 homepage sections listed above. Heavy focus on composition, typography, image treatment, scroll behavior, responsive.

**Commit**: `phase-2-homepage`  
**STOP.**

---

### PHASE 3 — ABOUT + COMMUNITY STORY
**Goal**: Editorial About page.

Hero → Origin → Philosophy → Values → What We Ride → Culture → Timeline → Final CTA.

**Commit**: `phase-3-about`  
**STOP.**

---

### PHASE 4 — RIDER DIRECTORY
**Goal**: Premium, filterable, searchable directory.

Typed Rider schema + privacy flags, RiderCard, RiderGrid, RiderFilters, RiderSearch, loading/empty/error states. Mobile-first (no hover-only interactions).

**Commit**: `phase-4-riders-directory`  
**STOP.**

---

### PHASE 5 — RIDER PROFILE
**Goal**: Premium individual rider experience + dynamic SEO.

`/riders/[slug]`: hero, metadata, story, motorcycle showcase, riding identity, contributions, gallery, prev/next. Dynamic metadata + structured data. Privacy flags enforced.

**Commit**: `phase-5-rider-profile`  
**STOP.**

---

### PHASE 6 — DATABASE + REAL CONTENT
**Goal**: Live Supabase backend.

Schema, migrations, seed data (fictional but realistic), Storage + RLS, typed data-access layer, Zod validation, replace mocks. Privacy flags server-side.

**Commit**: `phase-6-real-data`  
**STOP.**

---

### PHASE 7 — RIDES + EVENTS + GALLERY
**Goal**: Community content surfaces.

`/rides`, `/rides/[slug]`, `/gallery` with cards, detail pages, filtering, lightbox, relationships.

Read these files first:
- CURRENT_STATUS.md
- SPIRITUAL_RIDERS_CLAUDE_CODE_MASTER_PROMPT.md
- src/lib/riders.ts and the existing data layer patterns

Context:
- Phases 0 to 6 are completed.
- Live Supabase connection is now working.
- Do not modify existing Rider-related code unless necessary.

Now implement ONLY Phase 7: Rides + Events + Gallery

### Requirements for Phase 7:

1. **Rides**
   - Create `/rides` page (list of all rides)
   - Create `/rides/[slug]` page (individual ride detail)
   - Ride Card and Ride Detail should show:
     - Cover image
     - Title
     - Date & Location
     - Distance
     - Rider count
     - Description
     - Dynamic Status badge

2. **Dynamic Ride Status Logic** (Important)
   Calculate status on the server based on the ride date:
   - Upcoming → ride date is in the future
   - Ongoing  → ride date is today
   - Completed → ride date is in the past

   Display the status as a clear badge on both the list and detail pages.

3. **Gallery**
   - Create `/gallery` page
   - Support basic filtering
   - Premium lightbox when clicking images
   - Allow images to be linked to a rider or a ride

4. **Database**
   - Create necessary tables (`rides`, `gallery`) with proper relationships
   - Add migration + seed data
   - Follow the same clean pattern used in Phase 6 (typed data access layer + Zod)

5. **Rules**
   - Keep the existing design system and visual language
   - Prefer Server Components
   - Do not break existing pages
   - After finishing, update CURRENT_STATUS.md
   - Then STOP and wait for my next instruction

Now implement Phase 7 only.

---

### PHASE 8 — ADMIN / CONTENT MANAGEMENT
**Goal**: Secure admin (only after public site is solid).

`/admin` with Supabase Auth, server-side authorization, CRUD for riders/rides/gallery + community settings. Image upload validation, protected routes.

Read these files first:
- CURRENT_STATUS.md
- SPIRITUAL_RIDERS_CLAUDE_CODE_MASTER_PROMPT.md

Context:
- Phases 0 to 7 are fully completed and working.
- Live Supabase is connected.
- Do NOT modify or rewrite earlier phases unless absolutely necessary.

Now implement ONLY Phase 8: Admin / Content Management

### Requirements for Phase 8:

1. **Admin Route**
   - Create `/admin` (and related sub-routes if needed)
   - There must be **NO Admin link** visible in the public navigation or footer.
   - Admins will access it by directly visiting `/admin`.

2. **Authentication & Protection**
   - Use Supabase Auth
   - Protect all `/admin` routes with server-side checks
   - Unauthenticated users → show a clean Admin Login page
   - Authenticated but non-admin users → Access Denied
   - Only authorized admins can access the dashboard

3. **Admin Features to Implement**
   - Dashboard overview
   - **Rider Management**: Create, Edit, Feature/Unfeature, Archive, Upload images
   - **Ride Management**: Create, Edit, Feature, Archive
   - **Gallery Management**: Upload, Reorder, Delete, Link to Rider/Ride
   - **Community Settings**: Basic site settings (name, tagline, social links, etc.)

4. **Technical Rules**
   - Keep the existing design system (but Admin UI can be more functional/clean)
   - Use Server Components + Server Actions where possible
   - Never expose service-role key to the browser
   - Follow proper RLS and authorization
   - After finishing → Update CURRENT_STATUS.md
   - Then STOP and wait for my next instruction

Now implement Phase 8 only. 
**STOP.**

---

### PHASE 9 — POLISH / CINEMATIC MOTION
**Goal**: Dedicated visual & interaction polish (not “add more effects”).

Review every page. Improve transitions, hover/tap, image reveals, typography rhythm, micro-interactions. Full reduced-motion support + mobile motion simplification.

**Commit**: `phase-9-motion-polish`  
**STOP.**

---

### PHASE 10 — SEO / ACCESSIBILITY / PERFORMANCE / SECURITY HARDENING
**Goal**: Production-ready technical quality.

Full SEO (metadata, OG, sitemap, robots, structured data), a11y audit, performance (Core Web Vitals, bundle, images), security (RLS, env, validation, route protection).

**Commit**: `phase-10-hardening`  
**STOP.**

---

### PHASE 11 — TESTING
**Goal**: Automated confidence on critical paths.

Vitest + Playwright e2e (homepage, navigation, riders search/filter/profile, admin auth/CRUD) + accessibility checks. Test report.

**Commit**: `phase-11-testing`  
**STOP.**

---

### PHASE 12 — PRODUCTION RELEASE
**Goal**: Live, monitored, rollback-ready deployment.

Production env, migrations, storage, domain, SEO final, optional privacy-conscious analytics, error monitoring, Vercel deploy, smoke tests, rollback docs.

**Commit**: `phase-12-production`

---

## 10. MANDATORY REPORTING FORMAT (after every phase)

```
SPIRITUAL RIDERS
================

PHASE: X — <NAME>

STATUS:
✅ Complete / ⚠️ Partial / ❌ Blocked

WHAT WAS IMPLEMENTED
- ...
- ...

FILES CREATED / UPDATED
- ...
- ...

VALIDATION
✅ TypeScript
✅ ESLint
✅ Build
✅ Tests (if applicable)

DESIGN NOTES
- ...

SECURITY NOTES
- ...

PERFORMANCE NOTES
- ...

DECISIONS FOR USER
1. ...
2. ...

ACCEPTANCE CHECKLIST
[x] ...
[x] ...
[ ] ...

NEXT PHASE
Phase X+1 — ...

WAITING FOR INSTRUCTION
```

### Mandatory Status File Update
After completing every phase and generating the official phase report, you must also:

1. Update (or create if missing) the file `CURRENT_STATUS.md` in the project root.
2. Overwrite it with the latest complete status, including:
   - List of all completed phases
   - Summary of what was implemented in the latest phase
   - Key files created/updated
   - Validation results
   - Known limitations
   - Exact next phase
   - Short instructions for the next AI tool

This file is the permanent bridge when switching between different AI coding tools.

---

## 11. CROSS-PHASE RULES

- After every phase: lint + typecheck + build must pass. Never leave a broken state.
- Use realistic but clearly fictional sample data until real community content is provided.
- Privacy flags for age / blood group / city / socials must be respected in UI, API, metadata, and structured data.
- Prefer Server Components. Client Components only when interactivity requires them.
- No service-role keys in the browser.
- Every dynamic page must handle loading / empty / error / 404 gracefully.

---

## 12. FINAL QUALITY TARGET

The finished website should feel like:  
**Luxury motorcycle brand + cinematic editorial website + premium community showcase.**

A visitor should immediately understand:
1. What Spiritual Riders is
2. Who the riders are
3. What motorcycles they ride
4. What the community stands for
5. Why it feels unique
6. How to explore individual riders
7. How to connect with the community

---

**START NOW WITH PHASE 0 ONLY.**

Inspect the workspace. If empty, initialize the Next.js application correctly.  
Implement Phase 0 completely. Validate. Document.  
Then STOP and wait for the next instruction.
