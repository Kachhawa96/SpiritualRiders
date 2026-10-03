# DEVELOPMENT.md — Spiritual Riders

## Development Workflow

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Git

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for all variables. Variables prefixed `NEXT_PUBLIC_` are
exposed to the browser — **never put secrets there**.

---

## Code Quality Rules

### TypeScript

- **Strict mode is non-negotiable** — no `any`, no `@ts-ignore` without a comment.
- All functions must have explicit return types (or let TypeScript infer cleanly).
- No unused variables or imports — enforced by `noUnusedLocals` + `noUnusedParameters`.
- Use `type` for simple shapes; `interface` for extendable data structures.

### Component Guidelines

1. **Server Components by default** — only add `"use client"` when you need:
   - `useState`, `useEffect`, `useRef`
   - Event handlers
   - Browser APIs
   - Animation libraries (Motion)

2. **File naming** — PascalCase for components (`RiderCard.tsx`), kebab-case for routes.

3. **One component per file** — unless the sub-components are tiny helpers used nowhere else.

4. **Props** — Always define an interface for component props. Never use inline `{}` types.

5. **No prop drilling beyond 2 levels** — lift state or use context/Zustand (Phase 6+).

### CSS / Styling

- Use CSS variables from `globals.css` — never hardcode hex colors.
- Use Tailwind utility classes for layout and spacing.
- Avoid ad-hoc `style={{}}` inline styles except for dynamic CSS variable values.
- Global styles only in `globals.css` or dedicated CSS modules.

### Imports

Always use path aliases, never relative paths beyond one level:

```ts
// Correct
import { cn } from "@/lib/utils";
import type { Rider } from "@/types/rider";

// Avoid
import { cn } from "../../lib/utils";
```

---

## Git Workflow

### Branch Naming

```
phase/0-foundation
phase/1-brand-shell
phase/2-homepage
feature/rider-card-component
fix/mobile-nav-overflow
```

### Commit Format

```
feat: implement RiderCard component with hover animation
fix: correct privacy flag check for blood group display
docs: update DESIGN_SYSTEM.md with motion tokens
chore: add typecheck script to package.json
```

### Phase Commits

Each phase ends with a commit: `phase-X-name` (e.g., `phase-0-foundation`).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build (validates types + bundle) |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check (tsc --noEmit) |
| `npm run lint:fix` | Auto-fix ESLint issues |

**Before every commit**: `npm run lint && npm run typecheck && npm run build`

---

## Phase Validation Checklist

At the end of every phase:

- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run build` — successful production build
- [ ] All routes render without hydration errors
- [ ] Mobile layout tested (375px, 768px breakpoints)
- [ ] No console errors in the browser
- [ ] `prefers-reduced-motion` tested (disable animations in OS settings)
- [ ] Commit with exact message: `phase-X-name`

---

## Privacy Rules (enforced from Phase 4+)

The following Rider fields are **private by default** and must be hidden
unless the corresponding flag is `true`:

| Field | Flag |
|-------|------|
| `age` | `show_age` |
| `blood_group` | `show_blood_group` |
| `city` | `show_city` |
| `instagram_url`, `facebook_url`, `youtube_url`, `website_url` | `show_social_links` |

**Privacy must be enforced server-side** — never rely on the UI to hide private fields.
These flags apply to: UI display, API responses, OG metadata, and structured data.

---

## Adding a New Page (Checklist)

1. Create route file: `src/app/[route]/page.tsx`
2. Add static or dynamic `metadata` export.
3. Handle loading state: `loading.tsx`
4. Handle error state: `error.tsx`
5. Handle 404: `not-found.tsx`
6. Add route to `ROUTES` in `src/config/site.ts`.
7. Ensure the page has a single `<h1>`.
8. Test at 375px, 768px, 1280px.

---

## Troubleshooting

### "Module not found: @/..."
TypeScript path aliases are configured in `tsconfig.json`. Restart the dev server after changes.

### "Type error: Property X does not exist on type Y"
Run `npm run typecheck` to see all errors. Fix them before proceeding.

### Build fails after adding a new package
Run `npm install` then try `npm run build` again.

### Font not loading
Google Fonts are loaded via `next/font/google` in `src/app/layout.tsx`.
They require a network connection on first run (then cached locally).
