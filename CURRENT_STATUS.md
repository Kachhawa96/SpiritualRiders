# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-04  
**Current Phase Completed**: Phase 7 — Rides + Events + Gallery  
**Overall Status**: ✅ Live Supabase connection active for riders, rides, and gallery. Privacy and status badges verified.  
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
- [x] **Phase 7 — Rides + Events + Gallery** (Completed: 2026-10-04)
- [ ] Phase 8 — Admin / Content Management
- [ ] Phase 9 — Polish / Cinematic Motion
- [ ] Phase 10 — SEO / Accessibility / Performance / Security Hardening
- [ ] Phase 11 — Testing (Vitest + Playwright)
- [ ] Phase 12 — Production Release

---

## 2. SUMMARY OF LATEST PHASE (PHASE 7)

### What Was Implemented
- `/rides` with search and filters for kind and status
- `/rides/[slug]` with the story, facts, named crew, and frames from that ride
- `/gallery` with a ride filter and a lightbox (close button, Escape, focus trap)
- Relationships: a ride lists public rider names and links to profiles. A frame links to its ride and its rider. Hidden rider columns are not selected
- Homepage ride highlight now uses the same featured ride
- `/rides` and `/gallery` are in `LIVE_ROUTES`

Tables and views: `rides`, `ride_riders`, `gallery_items`, and the public views `ride_public`, `ride_participant_public`, `gallery_public`. The participant and gallery views join `rider_public`, not the private rider table.

The anon key cannot read the new base tables. `ride_public`, `gallery_public`, and `ride_participant_public` are applied on the connected project. The app is reading those views. Status values come from the database (`completed` shows as Ridden, `upcoming` shows as Ahead).

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `supabase/migrations/20261004180000_rides_gallery.sql` | Rides, links, gallery, public views |
| `supabase/seed-community.sql` | Fictional rides, crew links, and frames |
| `src/data/community.ts` | Public seed, no private rider fields |
| `src/lib/db/community-schema.ts` | Zod schemas |
| `src/lib/db/community.ts` | Supabase read, seed if the views are missing |
| `src/lib/community.ts` | Ride and gallery APIs |
| `src/lib/ride-labels.ts` | Public labels, safe for the browser |
| `src/app/rides/page.tsx` | Ride list |
| `src/app/rides/[slug]/page.tsx` | Ride detail |
| `src/app/gallery/page.tsx` | Gallery and lightbox host |
| `src/components/rides/RideBrowser.tsx` | Search and filters |
| `src/components/rides/RideCard.tsx` | Ride card |
| `src/components/gallery/GalleryBrowser.tsx` | Filter and lightbox |
| `src/components/sections/home/RideHighlight.tsx` | Uses the featured ride from the data layer |
| `src/config/site.ts` | `/rides` and `/gallery` are live routes |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed
- **TypeScript**: ✅ Passed
- **Production Build**: ✅ Passed. Six ride pages, gallery, crew, about, and home
- **Browser check**: Night-ride filter hides Salt and Silence. Lightbox opens on a frame and links the rider. Salt and Silence on a 390px screen shows the story. Pune is absent from the rides and gallery HTML
- **Live rides and gallery** (2026-10-04): ✅ Six rides and eight frames, with database UUID ids. Pushkar Dawn is `upcoming` and shows Ahead. Salt and Silence is `completed` and shows Ridden. Arjun is named on Salt and Silence. His city is not in the ride, gallery, or profile HTML. The anon key cannot read `rides` or `riders`.

---

## 5. DESIGN & ARCHITECTURAL NOTES

- Frames are still drawn. The gallery lightbox is the detail view.
- A ride’s “from the crew” list is only riders the public view can name. The recorded line can be larger than that list.
- Client components import labels and types, not the database module.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-7-community-content` has not been created.
- Riders, rides, and gallery are live through `.env.local`. The local seed is not used while those views exist.
- Contact and admin are not built.
- Automated tests remain Phase 11.

---

## 7. EXACT NEXT PHASE

### **PHASE 8 — ADMIN / CONTENT MANAGEMENT**
- **Goal**: Secure `/admin` after the public site is solid.
- **Include**: Supabase Auth, server-side authorization, CRUD for riders, rides, and gallery, image upload checks, protected routes.
- **Do not**: put the service-role key in the browser.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-8-admin`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. Work in the repository root.
2. Implement **only Phase 8**.
3. Read `src/lib/db/client.ts` and the two SQL migrations before adding writes.
4. Writes must not use the anon key from a public page. Keep private rider columns behind the existing view.
5. Run lint, typecheck, and build before the phase report.
6. Overwrite this file with the Phase 8 status.
7. Stop and wait before Phase 9.
