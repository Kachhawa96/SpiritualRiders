# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-03  
**Current Phase Completed**: Phase 2 — Homepage Experience  
**Overall Status**: ✅ Healthy, Verified, Ready for Phase 3  
**Project Root**: repository root (package name `spiritual-riders`)

---

## 1. COMPLETED PHASES

- [x] **Phase 0 — Product & Architecture Foundation** (Completed: 2026-10-03)
- [x] **Phase 1 — Visual Identity + Global Shell** (Completed: 2026-10-03)
- [x] **Phase 2 — Homepage Experience** (Completed: 2026-10-03)
- [ ] Phase 3 — About + Community Story
- [ ] Phase 4 — Rider Directory
- [ ] Phase 5 — Rider Profile
- [ ] Phase 6 — Database + Real Content (Supabase)
- [ ] Phase 7 — Rides + Events + Gallery
- [ ] Phase 8 — Admin / Content Management
- [ ] Phase 9 — Polish / Cinematic Motion
- [ ] Phase 10 — SEO / Accessibility / Performance / Security Hardening
- [ ] Phase 11 — Testing (Vitest + Playwright)
- [ ] Phase 12 — Production Release

---

## 2. SUMMARY OF LATEST PHASE (PHASE 2)

### What Was Implemented
The temporary Phase 1 homepage was replaced with the ten-section cinematic homepage. The Phase 1 shell (header, menu, footer, page enter, tokens, buttons) is unchanged.

1. **Hero** — full viewport, road lines, gold eyebrow, “Ride Beyond Roads.”, supporting line, two actions. Headline stays visible. Background drifts only when motion is allowed.
2. **Community intro** — editorial split: “A brotherhood, not a listing.”
3. **Animated stats** — Riders 48, Machines 52, Rides 86, Years since 2020. Counts up in view. Reduced motion and first paint show the final number.
4. **Featured riders** — Vikram Rathore, Arjun Mehta, Kabir Sen. City is shown only when allowed. Arjun’s city is withheld.
5. **Brotherhood / values** — Respect before speed, The machine is kept, No one rides alone.
6. **Featured bikes** — Continental GT and R nineT, alternating layout.
7. **Timeline** — 2020 through 2026.
8. **Ride highlight** — Salt and Silence, 12 March 2026, 640 km, 18 riders.
9. **Gallery preview** — five frames, first one large.
10. **Final CTA** — write to the crew, plus a contact link.

Visuals are original line compositions (`ChapterFrame`), not stock photography. All figures and names are fictional.

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Composes the ten homepage sections |
| `src/data/home.ts` | Fictional homepage content, with city privacy applied |
| `src/components/visuals/ChapterFrame.tsx` | Shared road, machine, crew, dawn, salt, and rain frames |
| `src/components/sections/home/Hero.tsx` | Full-viewport hero |
| `src/components/sections/home/CommunityIntro.tsx` | House introduction |
| `src/components/sections/home/Stats.tsx` | Stat grid |
| `src/components/sections/home/StatCount.tsx` | In-view count-up |
| `src/components/sections/home/FeaturedRiders.tsx` | Three rider features |
| `src/components/sections/home/Values.tsx` | Brotherhood rules |
| `src/components/sections/home/FeaturedBikes.tsx` | Two machine features |
| `src/components/sections/home/Timeline.tsx` | Journey line |
| `src/components/sections/home/RideHighlight.tsx` | Featured ride |
| `src/components/sections/home/GalleryPreview.tsx` | Memory grid |
| `src/components/sections/home/FinalCta.tsx` | Closing call to write |
| `src/app/globals.css` | Hero drift animation |
| `ARCHITECTURE.md` | Homepage data and privacy note |
| `README.md` | Phase 2 marked complete |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed (`npm run lint`, 0 errors)
- **TypeScript**: ✅ Passed (`tsc --noEmit` inside `next build`)
- **Production Build**: ✅ Passed (Next.js 16.3.8, static `/` and `/_not-found`)
- **Browser check**: Desktop hero, crew, machines, and ride highlight, plus a 390px hero and stats grid. All ten sections are in the server HTML. “Pune” is absent. Jaipur and Udaipur are present.

---

## 5. DESIGN & ARCHITECTURAL NOTES

- The hero is pulled under the sticky header (`-mt-20`, `min-h-svh`) so the first screen is a full viewport. Header content still clears the bar.
- Frames are decorative and `aria-hidden`. Names, bikes, and copy carry the meaning.
- Links to `/riders`, `/riders/[slug]`, `/rides/[slug]`, `/gallery`, and `/contact` are real, and those pages still use the branded not-found until their phases.
- `LIVE_ROUTES` is still only `/`.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-2-homepage` has not been created.
- Homepage imagery is drawn, not photographed. Real community photography belongs with later content phases.
- Rider directory, profiles, rides, gallery, about, and contact pages are not built.
- Stats and stories are fictional placeholders.
- Automated tests remain Phase 11.

---

## 7. EXACT NEXT PHASE

### **PHASE 3 — ABOUT + COMMUNITY STORY**
- **Goal**: An editorial About page.
- **Route**: `/about`
- **Sequence**: Hero → Origin → Philosophy → Values → What We Ride → Culture → Timeline → Final CTA.
- **Then**: add `/about` to `LIVE_ROUTES` in `src/config/site.ts`.
- **Do not**: build the rider directory, profiles, rides, gallery, contact, or admin.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-3-about`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. Work in the repository root.
2. Implement **only Phase 3**.
3. Read `SPIRITUAL_RIDERS_CLAUDE_CODE_MASTER_PROMPT.md`, this file, `DESIGN_SYSTEM.md`, and `src/data/home.ts` so the about story does not contradict the homepage.
4. Reuse the shell, `SectionHeading`, `Reveal`, `Button`, `Container`, and `ChapterFrame`.
5. Add `/about` to `LIVE_ROUTES` when the page exists.
6. Keep privacy flags in mind even if this page has no rider records.
7. Run lint, typecheck, and build before the phase report.
8. Overwrite this file with the Phase 3 status.
9. Stop and wait before Phase 4.
