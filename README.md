# ChapterHut

A personal project: a cozy corner for readers and writers, built as a small
storefront for novels plus a light reading/blog experience.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 with CSS-variable theming (light/dark)
- `next-themes` for the dark mode toggle, `lucide-react` for icons
- Fonts via `next/font/google`: Poppins and Lusitana

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## Project structure

```
src/
  app/            # routes: / (home), /store
  lib/            # types and sample data
  ui/
    components/   # Navbar, ThemeToggle, HomeCard
    globals.css   # Tailwind + theme tokens
    fonts.ts      # font setup
public/           # images and assets
```

`@/` is aliased to `src/`.
