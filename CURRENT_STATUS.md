# SPIRITUAL RIDERS — CURRENT PROJECT STATUS

**Last Updated**: 2026-10-03  
**Current Phase Completed**: Phase 1 — Visual Identity + Global Shell  
**Overall Status**: ✅ Healthy, Verified, Ready for Phase 2  
**Project Root**: repository root (package name `spiritual-riders`)

---

## 1. COMPLETED PHASES

- [x] **Phase 0 — Product & Architecture Foundation** (Completed: 2026-10-03)
- [x] **Phase 1 — Visual Identity + Global Shell** (Completed: 2026-10-03)
- [ ] Phase 2 — Homepage Experience
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

## 2. SUMMARY OF LATEST PHASE (PHASE 1)

### What Was Implemented
- **Motion**: Installed `motion` v14. Shared durations and easings live in `src/lib/motion.ts` and match the CSS tokens. `MotionConfig reducedMotion="user"` wraps the shell.
- **UI primitives**:
  - `Button` — primary gold, outline, ghost, and glow. Renders a Next.js link for app routes, a plain anchor for hash and mailto links.
  - `Card` — obsidian surface, optional index, eyebrow, title, and description. Hover lift is an enhancement; the resting state is complete on touch.
  - `SectionHeading` — editorial eyebrow rule, display title, muted subtitle.
  - `Container` — already present from Phase 0; used by the shell.
- **Motion wrappers**:
  - `Reveal` — fade and rise once in view. Do not wrap the primary heading in it.
  - `AnimatedText` — word settle with opacity held at 1 so the hero can be the LCP element. `mask` mode exists for later below-fold lines.
  - `ImageReveal` — CSS clip wipe on the view timeline. The image stays visible if that timeline is unsupported. A Motion `whileInView` clip was tried and could remain shut, so it is not used.
  - `PageTransition` via `src/app/template.tsx` — short vertical settle, opacity held at 1. No exit animation and no splash screen.
- **Global shell**:
  - Sticky header with monogram, wordmark, blurred bar after scroll, and gold active state.
  - Desktop navigation from 1024px. Below that, a full-screen menu traps focus, locks scroll, closes on Escape, route change, or resize, and returns focus to the menu button.
  - Footer with brand, explore links, email, and copyright. Social rows render only when `SOCIAL_LINKS` has a URL.
  - Branded `not-found` page for routes that are not built yet.
  - Temporary homepage that shows the shell: hero, three identity cards, and the machines mark. This is not the Phase 2 homepage.
- **Typography wiring**: `next/font` now sets `--font-cormorant` and `--font-inter`. Those alias to `--font-display` and `--font-sans`.
- **CSS cascade fix**: heading, paragraph, and link defaults sit in `@layer base`. An unlayered `* { margin: 0; padding: 0 }` was overriding Tailwind spacing and color utilities. That reset was removed.

---

## 3. KEY FILES CREATED / UPDATED

| File | Purpose |
|------|---------|
| `src/components/ui/Button.tsx` | Gold, outline, ghost, and glow actions |
| `src/components/ui/Card.tsx` | Shell card surface |
| `src/components/ui/SectionHeading.tsx` | Editorial section title |
| `src/components/motion/Reveal.tsx` | In-view fade and rise |
| `src/components/motion/AnimatedText.tsx` | Word settle for headlines |
| `src/components/motion/ImageReveal.tsx` | CSS clip wipe |
| `src/components/motion/PageTransition.tsx` | Page enter settle |
| `src/components/layout/AppShell.tsx` | Header, menu, main, footer |
| `src/components/layout/Header.tsx` | Sticky desktop navigation |
| `src/components/layout/MobileNav.tsx` | Focus-trapped menu |
| `src/components/layout/Footer.tsx` | Chapter footer |
| `src/components/layout/BrandMark.tsx` | SR monogram and wordmark |
| `src/components/brand/RoadPlate.tsx` | Decorative chapter mark |
| `src/app/template.tsx` | Remounts the page transition |
| `src/app/page.tsx` | Temporary brand homepage |
| `src/app/not-found.tsx` | Branded missing-route page |
| `src/app/layout.tsx` | Fonts plus shell |
| `src/app/globals.css` | Cascade fix, card, wipe, reduced motion |
| `src/lib/motion.ts` | Shared duration and easing |
| `src/lib/navigation.ts` | Active-route matching |
| `src/config/site.ts` | `LIVE_ROUTES` prefetch allow-list |
| `src/hooks/useFocusTrap.ts` | Tab cycle inside the menu |
| `src/hooks/useBodyScrollLock.ts` | Scroll lock while the menu is open |
| `package.json` | `motion` dependency |
| `ARCHITECTURE.md` | Shell and cascade decisions |
| `DESIGN_SYSTEM.md` | Phase 1 components and motion |
| `README.md` | Phase 1 marked complete |

---

## 4. VALIDATION RESULTS

- **ESLint**: ✅ Passed (`npm run lint`, 0 errors)
- **TypeScript**: ✅ Passed (`npm run typecheck` / `tsc --noEmit`, and again inside `next build`)
- **Production Build**: ✅ Passed (Next.js 16.3.8, static routes `/` and `/_not-found`)
- **Browser check**: Homepage (desktop and 390px), mobile menu open/close path, and `/about` not-found were exercised in headless Chrome. Cormorant Garamond loads. Gold text, button padding, the road plate (612×816), and reduced-motion opacity all checked out.

---

## 5. DESIGN & ARCHITECTURAL NOTES

- **No splash screen.** The first paint is the shell. The hero headline is visible immediately.
- **Desktop nav starts at 1024px.** Narrower viewports use the full-screen menu.
- **`LIVE_ROUTES`** is currently `["/"]`. Navigation only prefetches live routes. Add a path when that phase ships.
- **Unbuilt URLs** (`/about`, `/riders`, `/rides`, `/gallery`, `/contact`) render the branded not-found page inside the shell. Do not build those pages in Phase 2 except as the homepage experience requires.
- **Reduced motion** is forced in CSS on `[data-motion-reveal]`. Do not rely only on a hydration-time hook.
- **Element CSS belongs in `@layer base`.** Do not reintroduce an unlayered universal margin/padding reset.
- **Server Components stay the default.** Client islands are the shell, the menu, and the reveal/text/page-enter wrappers.

---

## 6. KNOWN LIMITATIONS & PENDING ITEMS

- The git commit `phase-1-brand-shell` has not been created. Run it when you want this phase recorded.
- The homepage is a temporary shell. Phase 2 replaces it with the ten-section cinematic homepage.
- Social URLs in `src/config/site.ts` are null, so the footer shows email and the founded line only.
- Sample rider and ride data are still Phase 4 and Phase 7.
- Supabase starts in Phase 6.
- Automated tests are Phase 11. This phase was checked with lint, typecheck, build, and a headless browser pass.

---

## 7. EXACT NEXT PHASE

### **PHASE 2 — HOMEPAGE EXPERIENCE**
- **Goal**: Replace the temporary homepage with the cinematic, production-feeling page. Use realistic fictional mock data.
- **Sections, in order**:
  1. Cinematic full-viewport Hero
  2. Community Intro
  3. Animated Stats
  4. Featured Riders
  5. Brotherhood / Values
  6. Featured Bikes
  7. Timeline
  8. Ride Highlight
  9. Gallery Preview
  10. Final CTA
- **Keep**: the Phase 1 shell (header, menu, footer, page enter, tokens, Button, Card, SectionHeading, Reveal, AnimatedText, ImageReveal).
- **Do not**: build `/about`, `/riders`, `/rides`, `/gallery`, `/contact`, or `/admin` beyond what already 404s. Do not add a splash screen.
- **Hero copy direction**: “Ride Beyond Roads.” / “More Than Riders. One Spirit.” Improve it if better copy emerges.
- **Validate**: `npm run lint`, `npm run typecheck`, `npm run build`.
- **Commit target**: `phase-2-homepage`.

---

## 8. INSTRUCTIONS FOR NEXT AI TOOL

1. **Working directory**: the repository root (`SpiritualRiders`).
2. **Phase isolation**: implement **only Phase 2**. Do not start Phase 3.
3. **Read first**: `SPIRITUAL_RIDERS_CLAUDE_CODE_MASTER_PROMPT.md`, this file, `DESIGN_SYSTEM.md`, and `ARCHITECTURE.md`.
4. **Reuse the shell.** The header, footer, menu, and motion primitives already exist. Replace `src/app/page.tsx` with the ten homepage sections.
5. **When a route becomes real**, add it to `LIVE_ROUTES` in `src/config/site.ts`.
6. **Respect** `prefers-reduced-motion`, privacy flags (not shown yet, but do not drop them), and the no-splash decision.
7. **Validation** before reporting:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
8. **Reporting**: use the mandatory format in Section 10 of the master prompt.
9. **Status update**: overwrite this file with the Phase 2 status.
10. **Stop** and wait for an explicit instruction before Phase 3.
