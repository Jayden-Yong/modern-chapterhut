<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ChapterHut — Project Reference

Cozy storefront for novels + light reading/blog. Personal project, early stage.

## Stack

- Next.js 16.2.10 (App Router) + React 19.2.4 + TypeScript (`package.json`)
- Tailwind CSS v4 (`@import "tailwindcss"` in `src/ui/globals.css:1`)
- `lucide-react` icons, `next-themes` for dark mode (see Gotchas)
- Fonts via `next/font/google`: Poppins + Lusitana (`src/ui/fonts.ts:1-11`)

## Commands

- `npm run dev` — dev server (`localhost:3000`)
- `npm run build` / `npm start` — production build/serve
- `npm run lint` — ESLint (`eslint-config-next`)

## Workflow

- One branch fixes one issue. Name the branch for the issue's code — issue #2 is `MCH-4`,
  issue #4 is `MCH-5`. Never `fix/store-navbar` or `main`-adjacent names.
- Work too small to warrant its own issue — an adjacent one-line fix in the same file,
  or a correction to this file — rides along on the branch of the issue it serves, and
  gets named in that issue's comment so it is not mistaken for scope creep.
- Anything larger than that gets its own issue first.
- After a branch changes code, re-read this file and update whatever the change made
  stale — line references, structure entries, gotchas. A branch that edits code but
  leaves this file describing the old behaviour is not done.

## Structure

```
src/
  app/
    layout.tsx          # root layout: fonts, Navbar, container
    page.tsx            # / home: hero + 2x HomeCard
    store/
      layout.tsx        # <main>{children}</main> only — no Navbar
      page.tsx          # /store stub: single <p>
    favicon.ico / icon.png / apple-icon.png / manifest.webmanifest
  lib/
    definitions.ts      # Novel type
    placeholder-data.ts # unused novels array
  ui/
    components/
      Navbar.tsx        # client nav, Home/Store, Cart(0), mobile menu
      HomeCard.tsx      # 10-col feature card, invertOrder prop
      ThemeProvider.tsx # client wrapper: next-themes, attribute="class"
      ThemeToggle.tsx   # client dark toggle, useTheme + useSyncExternalStore
    globals.css         # Tailwind + CSS-var theme tokens
    fonts.ts            # lusitana + poppins CSS vars
  pages/                # EMPTY — ignore, App Router only
public/
  chapterhut_icon.png / dream-bubble.png / home/{puzzle,growth}.png
```

`@/*` is aliased to `src/*` (`tsconfig.json:21-23`).
`CLAUDE.md` is just `@AGENTS.md`. `README.md:31-42` is slightly stale.

## Routes

- `/` — `src/app/page.tsx:8-34`: centered hero (`font-poppins`), `next/image` hero, 2x `<HomeCard invertOrder={false|true}>`
- `/store` — `src/app/store/page.tsx:1-5`: stub only
- Root layout `src/app/layout.tsx:12-27`: `<html class={poppins.variable lusitana.variable}>`, `<ThemeProvider>`, `<Navbar/>`, content wrapper `grow container mx-auto px-4 md:px-20 py-6`

## UI / Theming Conventions

- Use token classes, not hardcoded colors: `bg-background text-foreground bg-surface text-muted text-accent border-border hover:bg-accent-hover`
- Tokens defined `src/ui/globals.css:9-42`: light `:root` (`--background:#FDEBD3` etc.) + `:root.dark` overrides; wired via `@theme inline` + `@custom-variant dark (&:where(.dark, .dark *))`
- Fonts: `font-poppins` for body/UI, `font-lusitana` for brand/headings/nav (`Navbar.tsx:21`, `HomeCard.tsx:27`)
- Client components need `'use client'`: Navbar (useState + usePathname), ThemeToggle (useTheme + useSyncExternalStore), ThemeProvider (context passthrough)
- Navbar pattern `src/ui/components/Navbar.tsx:13-18`: `navlinks=[{Home,/},{Store,/store}]`, `activePage` via `usePathname()`, desktop `hidden md:flex`, mobile `md:hidden` toggle

## Data

- `Novel` in `src/lib/definitions.ts:1-7`: `{id, novel_name, author_id, status:'ongoing'|'completed'|'draft', date_created}`
- `src/lib/placeholder-data.ts:1-32`: 5 sample novels, currently unimported anywhere — use when wiring real list/detail pages

## Gotchas — Do Not Reintroduce

1. Theming runs through `next-themes` (v0.4, a runtime dependency). `ThemeProvider.tsx:7` wraps the app in `<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>`, mounted once in the root layout (`layout.tsx:16-23`). `ThemeToggle.tsx` reads `useTheme()` and gates on `useSyncExternalStore` for SSR safety. Do not hand-roll a second `classList.toggle("dark")` — `attribute="class"` is what pairs with `@custom-variant dark` at `globals.css:32`.
2. `src/pages/` is empty legacy — all routes are App Router in `src/app/`.
3. `/store` layout is passthrough — don't nest duplicate `<Navbar/>` there.
4. `Cart (0)` in Navbar desktop/mobile is hardcoded static.
5. Brand link in Navbar points to `/store` (`Navbar.tsx:35`), not `/` — intentional? Verify before changing.

# Layout Spacing and Alignment Guidelines

To maintain visual consistency and avoid layout bugs (such as squeezed mobile grids, inconsistent spacing, or cropped media elements):

1. **Responsive Grid Spanning (Mobile-First)**
   - Always define grid layouts mobile-first. If a grid is declared, ensure column spans are defined for all breakpoints (e.g., `col-span-1 md:col-span-3`) to prevent elements from defaulting to a single-column layout on mobile.

2. **Consistent Layout Padding**
   - When organizing multiple columns/blocks side-by-side or stacked, apply matching padding (e.g., `p-6 md:p-8`) across sibling blocks to keep the text and image boundaries aligned consistently with outer card borders.

3. **Absolute Elements & Padding Bounds (Next.js `<Image fill />`)**
   - Next.js's `<Image fill />` uses absolute positioning and ignores the parent's padding, which can lead to layout clipping or uneven gaps.
   - To make the image respect padding bounds while keeping its size dynamically maximized:
     - Add padding (e.g., `p-6 md:p-8`) to the grid/column cell wrapper.
     - Insert a relative inner wrapper (`w-full h-48 md:h-full min-h-[150px]`) inside the padded cell to house the `<Image fill className="object-contain" />`.

4. **Sibling Spacing Utilities (`space-y-*`)**
   - Never apply flex sibling spacing (e.g. `space-y-*`) directly to elements with single children (e.g., `<h3>{title}</h3>`). Use margin utilities (`mb-*`) on the element itself, or place the `space-y-*` utility on the parent container.
