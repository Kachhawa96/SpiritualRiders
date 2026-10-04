# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-04  
**Current Phase Completed**: Phase 6 — Database + Real Content  
**Overall Status**: ✅ Live Supabase connection active. Privacy view verified.  
**Project Root**: repository root (package name `spiritual-riders`)

---

## 1. COMPLETED PHASES

- [x] **Phase 0 — Product & Architecture Foundation** (Completed: 2026-10-03)
- [x] **Phase 1 — Visual Identity + Global Shell** (Completed: 2026-10-03)
- [x] **Phase 2 — Homepage Experience** (Completed: 2026-10-03)
- [x] **Phase 3 — About + Community Story** (Completed: 2026-10-03)
- [x] **Phase 4 — Rider Directory** (Completed: 2026-10-03)
- [x] **Phase 5 — Rider Profile** (Completed: 2026-10-03)
- [x] **Phase 6 — Database + Real Content** (Completed: 2026-10-04)
- [ ] Phase 7 — Rides + Events + Gallery
- [ ] Phase 8 — Admin / Content Management
- [ ] Phase 9 — Polish / Cinematic Motion
- [ ] Phase 10 — SEO / Accessibility / Performance / Security Hardening
- [ ] Phase 11 — Testing (Vitest + Playwright)
- [ ] Phase 12 — Production Release

---

## 2. SUMMARY OF LATEST PHASE (PHASE 6)

### What Was Implemented
The site now reads riders through one server data layer. Pages no longer assemble private records themselves.

- Postgres schema for `public.riders`
- View `public.rider_public` that nulls age, blood group, city, and social links when the flag is off
- Row Level Security on the base table, with no select grant for the anon key
- Storage bucket `rider-media`: public read, no public upload
- Seed of the same twelve fictional riders, including Arjun’s hidden city on the base row only
- Zod validation of every public row
- `@supabase/supabase-js` anon client. The service-role key is not read by the app

`.env.local` is set. The app reads `public.rider_public` from the connected Supabase project. Row ids are database UUIDs, so this is not the local seed. The anon key is denied on `public.riders` (`42501 permission denied`).

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `supabase/migrations/20261004120000_riders.sql` | Table, privacy view, storage bucket |
| `supabase/seed.sql` | Fictional crew, safe to re-run |
| `.env.example` | Public URL and anon key. Service role is documented as unused |
| `src/lib/db/client.ts` | Anon server client |
| `src/lib/db/public-rider.ts` | Zod schema for a public row |
| `src/lib/db/riders.ts` | Supabase read, or local seed when env is unset |
| `src/lib/riders.ts` | Directory and profile APIs over public rows only |
| `src/data/home.ts` | Featured riders are loaded asynchronously from that API |
| `src/app/riders/page.tsx` | Awaits the directory |
| `src/app/riders/[slug]/page.tsx` | Awaits the profile |
| `src/components/sections/home/FeaturedRiders.tsx` | Awaits the featured three |
| `ARCHITECTURE.md` | Data-layer notes |
| `README.md` | Phase 6 marked complete |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed
- **TypeScript**: ✅ Passed
- **Production Build**: ✅ Passed. Same routes as Phase 5, including twelve static profiles
- **Privacy check on the built HTML**: Pune, Delhi, Lucknow, and Indore do not appear. Imran’s blood group still appears because that flag is on
- **Live Supabase** (2026-10-04): ✅ `rider_public` returned 12 riders. Arjun’s city, age, blood group, and social link are null. Vikram’s city is Jaipur and his public link is present. Imran’s city is null and his blood group is present. Neel’s age and Jodhpur are present. The directory, Arjun’s profile, and the homepage render from that data and do not contain Pune.

---

## 5. DESIGN & ARCHITECTURAL NOTES

- The browser key can select `rider_public` only. It cannot select `public.riders`.
- The Next server uses that same anon key. It does not use the service role.
- Zod runs after the privacy projection, so a bad row fails closed.
- Photographs are still not uploaded. The bucket is ready for later phases.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-6-real-data` has not been created.
- Live Supabase is active through `.env.local`. The local seed is not used while those env vars are set.
- Rides, gallery, contact, and admin are not built.
- Automated tests remain Phase 11.

---

## 7. EXACT NEXT PHASE

### **PHASE 7 — RIDES + EVENTS + GALLERY**
- **Goal**: `/rides`, `/rides/[slug]`, and `/gallery`.
- **Include**: cards, detail pages, filtering, a lightbox, and relationships to riders.
- **Data**: add tables and a public projection in the same style as riders if the content should be real. Do not expose private rider columns through those pages.
- **Do not**: build admin auth or CRUD. That is Phase 8.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-7-community-content`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. Work in the repository root.
2. Implement **only Phase 7**.
3. Read `supabase/migrations/20261004120000_riders.sql` and `src/lib/db/riders.ts` before adding queries.
4. New tables need RLS and a public view or an equivalent mask. The anon key must not read hidden rider fields.
5. Do not import `src/data/mock-riders.ts` from a client component.
6. Run lint, typecheck, and build before the phase report.
7. Overwrite this file with the Phase 7 status.
8. Stop and wait before Phase 8.
