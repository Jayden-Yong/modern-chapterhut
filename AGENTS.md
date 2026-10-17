<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ChapterHut — Project Reference

Cozy storefront for novels + light reading/blog. Personal project, early stage.

## Stack

- Next.js 16.4.0 (App Router) + React 19.2.4 + TypeScript (`package.json`)
- Node 24 LTS (`.nvmrc`) — one pin, read by CI, the image and any local `nvm use`
- Tailwind CSS v4 (`@import "tailwindcss"` in `src/ui/globals.css:1`)
- `lucide-react` icons, `next-themes` for dark mode (see Gotchas)
- Postgres 18 through Drizzle ORM (`drizzle-orm` + `pg`) — schema in `src/lib/database/`, migrations in `drizzle/`
- Fonts via `next/font/google`: Poppins + Lusitana (`src/ui/fonts.ts:1-11`)

## Commands

- `npm run dev` — dev server (`localhost:3000`)
- `npm run build` / `npm start` — production build/serve
- `npm run lint` — ESLint (`eslint-config-next`), `--max-warnings=0` so local matches CI
- `npm run format` / `npm run format:check` — prettier (write / verify)
- `npm run db:generate` / `db:migrate` / `db:seed` — generate a migration, apply it, insert the fixture rows
- `docker compose -f docker-compose.dev.yml up -d` — local Postgres 18 for development only
- `docker build -t modern-chapterhut .` — production image (3 stages, standalone runtime)
- `docker compose up --build` — the same image, joined to the external `coolify` network

## Workflow

- One branch fixes one issue. Name the branch for the issue's code — issue #2 is `MCH-4`,
  issue #4 is `MCH-5`, issue #3 is `MCH-6`. Never `fix/store-navbar` or `main`-adjacent names.
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
      page.tsx          # /store: novel list, read through the repository
    favicon.ico / icon.png / apple-icon.png / manifest.webmanifest
  lib/
    constants/
      novel-status.ts   # NOVEL_STATUS_VALUES (as const) + NovelStatus derived from it
    models/
      novel.ts          # Novel — NovelStatus re-exported from constants
    contracts/
      novel-repository.ts  # NovelRepository — the port (interfaces only)
    database/
      schema.ts         # novelsTable, NovelRow, novel_status enum
      client.ts         # server-only pool -> drizzle db, type Database
      seed.ts           # inserts the fixture rows, idempotently
      transformers/
        novel-transformer.ts  # toNovel / toNovelRow / toNovels — the row <-> model seam
    placeholder-data.ts # fixture: Novel[] — the SEED source now, not a runtime source
    repositories/
      novels.ts         # Novels — reads Postgres through the transformer
      index.ts          # getNovelRepository() — the only swap point
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

Repo root, deploy-shaped:

```
next.config.ts     # `output: "standalone"` — what makes a slim runtime image possible
Dockerfile         # deps -> builder -> runner, node:24-alpine, runs as the `nextjs` user
.dockerignore      # excludes node_modules/.next/.git — must NOT exclude public/
docker-compose.yml # app only; joins the external `coolify` network
docker-compose.dev.yml # local Postgres 18 for development; never deployed
drizzle.config.ts  # drizzle-kit: schema, out, dialect; url from DIRECT_URL ?? DATABASE_URL
drizzle/           # generated SQL migrations + meta/ — COMMITTED, never gitignored
.nvmrc             # 24 — the Node pin CI reads via `node-version-file:`
.prettierrc.json   # tabWidth 4 — the one setting that preserves the hand-written style
.prettierignore    # package*.json (npm owns them), *.yml/*.svg (see Gotchas 11)
.pre-commit-config.yaml # generic hooks + local prettier/eslint, so pins live in devDependencies
.github/workflows/ # ci.yml (lint/types/build), docker.yml (build gate), security.yml (weekly audit)
.github/dependabot.yml # weekly npm / github-actions / docker dependency PRs
```

`@/*` is aliased to `src/*` (`tsconfig.json:21-23`).
`CLAUDE.md` is just `@AGENTS.md`. `README.md:31-42` is stale — its structure block still reads `lib/ # types and sample data` and shows no `models/`, `contracts/` or `repositories/`.

## CI

All three workflows live in `.github/workflows/` and fire on pull requests and pushes to `main`.

| Workflow       | Job(s)                   | What has to pass                                                                      |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `ci.yml`       | `lint`, `types`, `build` | `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run build`           |
| `docker.yml`   | `build`                  | the Dockerfile builds — buildx with `push: false`, a gate and not a deploy            |
| `security.yml` | `audit`                  | weekly cron (Mondays) plus manual dispatch: `npm audit --omit=dev --audit-level=high` |

Run the same set locally before pushing:

```
npm ci && npm run lint && npm run format:check && npx tsc --noEmit && npm run build
```

The `build` job then asserts the **dynamic-rendering invariant**, because a green build says
nothing about how a route renders — and `/store` must not be prerendered, since the build runs
with no database:

- `.next/standalone/server.js` exists, alongside `.next/standalone/node_modules`
- `.next/server/app/store/page.js` exists — the route compiled at all
- `.next/server/app/store.html` does **not** exist
- `.next/server/app/store.meta` does **not** exist

Delete `export const dynamic = "force-dynamic"` from `src/app/store/page.tsx` and this job fails,
which is the point: a prerendered `/store` means the image build needs a live database.

Node comes from `.nvmrc` in every job via `node-version-file:` — bump that one file, never the
workflows one by one. Dependabot opens weekly PRs for npm, the Actions and the Docker base image,
all labelled `dependencies`.

`npm audit fix` cannot move the pinned `next` — the pin _is_ the declared range. Security bumps
land as `npm install next@<latest> eslint-config-next@<latest> --save-exact`, then `npm audit fix`
for what is left underneath.

## Routes

- `/` — `src/app/page.tsx:8-34`: centered hero (`font-poppins`), `next/image` hero, 2x `<HomeCard invertOrder={false|true}>`
- `/store` — `src/app/store/page.tsx:8-9`: async Server Component with `force-dynamic`; `await getNovelRepository().findAll()` reads Postgres through the transformer, then renders each novel (name, status, and id · author · date). Rendered per request — see Gotcha 9.
- Root layout `src/app/layout.tsx:12-27`: `<html class={poppins.variable lusitana.variable}>`, `<ThemeProvider>`, `<Navbar/>`, content wrapper `grow container mx-auto px-4 md:px-20 py-6`

## UI / Theming Conventions

- Use token classes, not hardcoded colors: `bg-background text-foreground bg-surface text-muted text-accent border-border hover:bg-accent-hover`
- Tokens defined `src/ui/globals.css:9-42`: light `:root` (`--background:#FDEBD3` etc.) + `:root.dark` overrides; wired via `@theme inline` + `@custom-variant dark (&:where(.dark, .dark *))`
- Fonts: `font-poppins` for body/UI, `font-lusitana` for brand/headings/nav (`Navbar.tsx:21`, `HomeCard.tsx:27`)
- Client components need `'use client'`: Navbar (useState + usePathname), ThemeToggle (useTheme + useSyncExternalStore), ThemeProvider (context passthrough)
- Navbar pattern `src/ui/components/Navbar.tsx:13-18`: `navlinks=[{Home,/},{Store,/store}]`, `activePage` via `usePathname()`, desktop `hidden md:flex`, mobile `md:hidden` toggle

## Data

- `Novel` in `src/lib/models/novel.ts:3-9`: `{id, novel_name, author_id, status, date_created}`. `NovelStatus` lives in `src/lib/constants/novel-status.ts:3` and is derived from `NOVEL_STATUS_VALUES` — one `as const` array feeds the TS union, the `pgEnum` and the Postgres type, so a new status is one line
- `NovelRepository` in `src/lib/contracts/novel-repository.ts:3-7`: `findAll()`, `findById(id)`, `findByAuthor(authorId)` — untouched by the move to Postgres, which is the whole point of the port
- `src/lib/database/schema.ts`: `novelsTable` (camelCase keys, snake_case columns) and `NovelRow = typeof novelsTable.$inferSelect`
- `src/lib/database/transformers/novel-transformer.ts`: `toNovel` (row -> model), `toNovelRow` (model -> row), `toNovels` — the only place the two shapes meet. Returning a Drizzle row straight from a repository deletes this boundary by accident
- `src/lib/repositories/novels.ts`: `Novels` takes the `Database` client and queries through the transformer
- Which implementation is live is decided in exactly one place: `getNovelRepository()` (`src/lib/repositories/index.ts:9`)
- `src/lib/placeholder-data.ts:1-38` is the **seed source** now — `src/lib/database/seed.ts` inserts it, idempotently. No component may import it (Gotcha 6)

## Gotchas — Do Not Reintroduce

1. Theming runs through `next-themes` (v0.4, a runtime dependency). `ThemeProvider.tsx:7` wraps the app in `<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>`, mounted once in the root layout (`layout.tsx:16-23`). `ThemeToggle.tsx` reads `useTheme()` and gates on `useSyncExternalStore` for SSR safety. Do not hand-roll a second `classList.toggle("dark")` — `attribute="class"` is what pairs with `@custom-variant dark` at `globals.css:32`.
2. `src/pages/` is empty legacy — all routes are App Router in `src/app/`.
3. `/store` layout is passthrough — don't nest duplicate `<Navbar/>` there.
4. `Cart (0)` in Navbar desktop/mobile is hardcoded static.
5. Brand link in Navbar points to `/store` (`Navbar.tsx:35`), not `/` — intentional? Verify before changing.
6. Data access goes through `NovelRepository`. Never import `placeholder-data.ts` from a
   component — it is the seed source now, and pointing a page at the array re-couples the UI to
   a fixture the database no longer tracks. Swap implementations in `repositories/index.ts`
   only.
7. Contracts live in `src/lib/contracts/<thing>.ts`; implementations live in their layer folder
   (`src/lib/repositories/`, later `src/lib/services/`). The dependency runs one way — an adapter
   imports a port, never the reverse — and the path never repeats the concept
   (`contracts/novel-repository.ts`, not `contracts/repositories/novel-repository.ts`). A service
   layer is the next layer _if and when_ a rule spans repositories or needs authorization, not before.
8. The container serves `.next/standalone`, which holds `server.js` and `node_modules` but
   **neither `public/` nor `.next/static`**. The last two `COPY` lines of the Dockerfile's runner
   stage are the only thing that puts them there — drop either and every asset 404s while
   `docker build` still reports success. When a change misses in the image, check those two lines
   before anything else, and remember `next.config.ts` must keep `output: "standalone"`.
9. `/store` is `force-dynamic` (`src/app/store/page.tsx:6`) because its data access hits Postgres.
   A statically prerendered route would run that query during `npm run build` — in CI, where no
   database exists, and inside the Docker image, where Coolify builds before compose has started
   Postgres. Removing the export reintroduces both failures; the build job's assertion is what
   catches it.
10. `src/lib/database/client.ts` opens with `import "server-only"` — keep it first and keep
    `server-only` in `dependencies`. It turns an accidental client-component import into a build
    error instead of shipping `DATABASE_URL` to the browser. `pg` and `drizzle-orm/node-postgres`
    belong only in `client.ts` and `seed.ts`, never in a page or a component.
11. `package.json`, `package-lock.json`, `*.yml`/`*.yaml` and `*.svg` are deliberately outside
    prettier — see `.prettierignore`. npm owns the package files at 2-space, YAML keeps
    `mcp-server`'s hand-written idiom, and prettier 3 has **no SVG parser** (it errors on an SVG
    rather than skipping it). Adding any of them to a prettier glob turns `format:check`, and the
    lint job with it, red for files nobody meant to touch.

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
