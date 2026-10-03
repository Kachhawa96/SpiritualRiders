# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-03  
**Current Phase Completed**: Phase 4 — Rider Directory  
**Overall Status**: ✅ Healthy, Verified, Ready for Phase 5  
**Project Root**: repository root (package name `spiritual-riders`)

---

## 1. COMPLETED PHASES

- [x] **Phase 0 — Product & Architecture Foundation** (Completed: 2026-10-03)
- [x] **Phase 1 — Visual Identity + Global Shell** (Completed: 2026-10-03)
- [x] **Phase 2 — Homepage Experience** (Completed: 2026-10-03)
- [x] **Phase 3 — About + Community Story** (Completed: 2026-10-03)
- [x] **Phase 4 — Rider Directory** (Completed: 2026-10-03)
- [ ] Phase 5 — Rider Profile
- [ ] Phase 6 — Database + Real Content (Supabase)
- [ ] Phase 7 — Rides + Events + Gallery
- [ ] Phase 8 — Admin / Content Management
- [ ] Phase 9 — Polish / Cinematic Motion
- [ ] Phase 10 — SEO / Accessibility / Performance / Security Hardening
- [ ] Phase 11 — Testing (Vitest + Playwright)
- [ ] Phase 12 — Production Release

---

## 2. SUMMARY OF LATEST PHASE (PHASE 4)

### What Was Implemented
A searchable, filterable crew directory at `/riders`. Twelve fictional riders. The three homepage faces are the same people, in the same order, with the same machines.

- Search by name, machine, place in the line, or a city that is allowed to be shown.
- Filters for riding style, machine brand, and place in the line. Chips are real buttons, not hover menus. On small screens they sit behind “Narrow the line”.
- Empty state when nothing matches, with a clear action.
- Loading skeleton and an error state with “Try again”.
- Cards show name, place, machine, year, style, and city only when `show_city` is true. The whole card is a link. Nothing important is hidden until hover.
- `/riders` is in `LIVE_ROUTES`. Profile URLs still use the branded not-found page.

Privacy is applied on the server. Age, blood group, and social links are never copied into the directory payload. Arjun Mehta’s Pune, and the hidden cities for Ishaan, Mohit, and Imran, are not in the page HTML.

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `src/app/riders/page.tsx` | Directory route |
| `src/app/riders/loading.tsx` | Loading skeleton |
| `src/app/riders/error.tsx` | Error state with retry |
| `src/data/mock-riders.ts` | Full fictional records, server-only import |
| `src/lib/riders.ts` | Strips private fields before the client |
| `src/lib/directory.ts` | Search and filter, safe to run in the browser |
| `src/types/rider.ts` | `DirectoryRider` public row |
| `src/components/riders/RiderDirectory.tsx` | Search, filters, grid, empty state |
| `src/components/riders/RiderCard.tsx` | One rider, all facts visible |
| `src/components/riders/RiderGrid.tsx` | Responsive grid |
| `src/components/riders/RiderSearch.tsx` | Name or machine field |
| `src/components/riders/RiderFilters.tsx` | Style, machine, place |
| `src/components/riders/RiderDirectoryFallback.tsx` | Skeleton |
| `src/data/home.ts` | Featured riders now come from the directory projection |
| `src/config/site.ts` | `/riders` added to `LIVE_ROUTES` |
| `ARCHITECTURE.md` | Live routes include the crew |
| `README.md` | Phase 4 marked complete |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed
- **TypeScript**: ✅ Passed (inside `next build`, and `tsc --noEmit` before it)
- **Production Build**: ✅ Passed (static `/`, `/about`, `/riders`, `/_not-found`)
- **Browser check**: Desktop directory, empty search (“nomatch”), Cruiser filter (Mohit and Yash only), and a 390px layout. HTML does not contain Pune, Delhi, Lucknow, Indore, or blood groups.

---

## 5. DESIGN & ARCHITECTURAL NOTES

- The client receives `DirectoryRider` rows only. Do not import `src/data/mock-riders.ts` from a client component.
- “Member” is labeled “Rider” on the public site.
- Featured order on the homepage stays Vikram, Arjun, Kabir.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-4-riders-directory` has not been created.
- `/riders/[slug]` is not built. Cards link there and currently show the branded not-found page.
- Rides, gallery, contact, and admin are still unbuilt.
- Records are fictional. Supabase starts in Phase 6.
- Automated tests remain Phase 11.

---

## 7. EXACT NEXT PHASE

### **PHASE 5 — RIDER PROFILE**
- **Goal**: `/riders/[slug]` as a premium profile with dynamic SEO.
- **Include**: hero, metadata, story, motorcycle showcase, riding identity, contributions, gallery, previous and next rider.
- **Privacy**: enforce `show_age`, `show_blood_group`, `show_city`, and `show_social_links` in the UI, metadata, and structured data. Use the same server projection. Do not send hidden fields to the client.
- **Unknown slug**: branded 404.
- **Then**: profiles can stay off `LIVE_ROUTES` as a prefix, or prefetch only if you add a safe rule. Do not prefetch every slug blindly.
- **Do not**: add Supabase, the rides pages, gallery, or admin.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-5-rider-profile`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. Work in the repository root.
2. Implement **only Phase 5**.
3. Read `src/types/rider.ts`, `src/lib/riders.ts`, and `src/data/mock-riders.ts` before rendering a profile.
4. Keep `getDirectoryRiders` / a new profile mapper as the only door out of the mock file.
5. Arjun’s city, and every other hidden field, must stay out of the HTML, the title, and JSON-LD.
6. Run lint, typecheck, and build before the phase report.
7. Overwrite this file with the Phase 5 status.
8. Stop and wait before Phase 6.
