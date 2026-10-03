# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-03  
**Current Phase Completed**: Phase 5 — Rider Profile  
**Overall Status**: ✅ Healthy, Verified, Ready for Phase 6  
**Project Root**: repository root (package name `spiritual-riders`)

---

## 1. COMPLETED PHASES

- [x] **Phase 0 — Product & Architecture Foundation** (Completed: 2026-10-03)
- [x] **Phase 1 — Visual Identity + Global Shell** (Completed: 2026-10-03)
- [x] **Phase 2 — Homepage Experience** (Completed: 2026-10-03)
- [x] **Phase 3 — About + Community Story** (Completed: 2026-10-03)
- [x] **Phase 4 — Rider Directory** (Completed: 2026-10-03)
- [x] **Phase 5 — Rider Profile** (Completed: 2026-10-03)
- [ ] Phase 6 — Database + Real Content (Supabase)
- [ ] Phase 7 — Rides + Events + Gallery
- [ ] Phase 8 — Admin / Content Management
- [ ] Phase 9 — Polish / Cinematic Motion
- [ ] Phase 10 — SEO / Accessibility / Performance / Security Hardening
- [ ] Phase 11 — Testing (Vitest + Playwright)
- [ ] Phase 12 — Production Release

---

## 2. SUMMARY OF LATEST PHASE (PHASE 5)

### What Was Implemented
Each active rider now has a page at `/riders/[slug]`. Unknown names get a rider-specific not-found inside the shell.

The page has a hero, story, motorcycle, riding identity, contributions, a three-frame gallery, and previous/next links in directory order.

`generateMetadata` and JSON-LD are built only from the public profile. A hidden city, age, blood group, or social link is null before those strings are written.

Checked in the HTML:

- Arjun Mehta: no Pune, no age, no blood group, no social link
- Vikram Rathore: Jaipur and his public link are present
- Imran Sheikh: blood group is on the page, Indore is not
- Neel Kapoor: age and Jodhpur are present because those flags are on

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `src/app/riders/[slug]/page.tsx` | Profile route, metadata, JSON-LD |
| `src/app/riders/[slug]/not-found.tsx` | Unknown rider |
| `src/app/riders/[slug]/loading.tsx` | Loading state |
| `src/components/riders/RiderProfileView.tsx` | Profile layout |
| `src/lib/riders.ts` | `getRiderProfile` strips private fields |
| `src/types/rider.ts` | `RiderProfile` |
| `src/data/mock-riders.ts` | Longer stories, contributions, Vikram’s public link |
| `ARCHITECTURE.md` | Notes the profile routes |
| `README.md` | Phase 5 marked complete |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed
- **TypeScript**: ✅ Passed
- **Production Build**: ✅ Passed. Twelve static profile pages plus `/`, `/about`, `/riders`, and `/_not-found`
- **Browser check**: Vikram on desktop (hero, story, gallery, next rider) and Arjun on a 390px screen (captain, no city)

---

## 5. DESIGN & ARCHITECTURAL NOTES

- The profile is a server page. The browser never receives the raw mock record.
- Profile links are not added to `LIVE_ROUTES`, so the directory does not prefetch every slug.
- Gallery frames are drawn marks, same language as the rest of the site.
- Previous/next follows the directory order: featured riders first, then the rest by name.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-5-rider-profile` has not been created.
- There are still no photographs. The gallery is three drawn frames.
- Rides, the community gallery, contact, and admin are not built.
- Supabase replaces these fictional records in Phase 6.
- Automated tests remain Phase 11.

---

## 7. EXACT NEXT PHASE

### **PHASE 6 — DATABASE + REAL CONTENT**
- **Goal**: Live Supabase backend.
- **Include**: schema, migrations, fictional but realistic seed data, Storage and RLS, a typed data-access layer, Zod validation, and replacement of the mock records.
- **Privacy**: the same flags must be enforced in the server data layer before UI, metadata, or structured data.
- **Do not**: build the rides index, gallery page, or admin yet. Those are Phases 7 and 8.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-6-real-data`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. Work in the repository root.
2. Implement **only Phase 6**.
3. Read `src/types/rider.ts`, `src/lib/riders.ts`, and `src/data/mock-riders.ts` before replacing the data source.
4. Keep a single server function that nulls hidden age, blood group, city, and social links. Do not let components read the raw row.
5. Arjun’s city must stay hidden after the move to Supabase, including in seeds if the flag is false.
6. No service-role key in the browser. Document env vars in `.env.example` only.
7. Run lint, typecheck, and build before the phase report.
8. Overwrite this file with the Phase 6 status.
9. Stop and wait before Phase 7.
