# JobTrack — Job Application Tracker (Next.js + TypeScript + shadcn/ui)

Live: https://ali-sazzad.github.io/job-track/ (GitHub Pages, primary) · mirror: https://job-track-ruby.vercel.app/ (Vercel)

A frontend-only job application tracker designed to feel like a real internal tool: CRUD, fast filtering, a pipeline board, lightweight insights, and persistent storage in `localStorage`. Deployable to Vercel with zero config.

Rebuild of [ali-sazzad/job-track](https://github.com/ali-sazzad/job-track) on Next.js 16.3 / React 19.2 / Tailwind v4.

## Features

- **Tracker**: add / edit / delete applications, validated form (Enter submits, focus jumps to the first invalid field), delete with **Undo** toast
- **Search** (company, role, notes) + **status filter** + **sort** (newest, oldest, company, pipeline order)
- **Pipeline board** grouped by status, with empty and filtered-to-zero states
- **Insights**: KPI totals, response rate, status share bars (pure CSS), top companies
- **Settings**: density (comfort/compact), theme (system/light/dark), default sort, JSON/CSV export, JSON import (merges by id; newest edit wins), clear data, factory reset
- **Dark mode**: a sun/moon toggle in the header, kept in sync with the Theme setting and remembered across visits. Icons swap through CSS, so there's no flash on load.
- **Navigation**: a floating scroll-to-top button appears after you scroll down. Clicking the logo, or the nav link for the page you're on, scrolls back to the top.
- **App icons**: a "JT" favicon that adapts to light and dark browser themes (`icon2.svg`), an `.ico` fallback (`icon1.ico`, plus `public/favicon.ico` for browsers that request it directly), and a home-screen `apple-icon.png`
- **Accessibility**: skip link, labelled fields, `aria-invalid` + `aria-describedby` errors, `aria-current` nav, AlertDialogs instead of `confirm()`, and motion that respects `prefers-reduced-motion`

## Tech stack

Next.js (App Router, React Compiler) · React · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Sonner · next-themes · lucide-react

## localStorage keys

| Key | Contents |
| --- | --- |
| `jobtrack.apps.v1` | Array of applications (company, role, status, dates, link, notes, timestamps) |
| `jobtrack.prefs.v1` | `{ density, defaultSort }` |
| `theme` | Theme choice (managed by next-themes) |

The keys match the original project, so existing data carries over.

## Architecture notes

- **`src/lib/storage.ts`**: a small external store built on `useSyncExternalStore`. Every component reading a key shares one source of truth, so changing density in Settings updates the whole app immediately. It also syncs across tabs through the `storage` event. The server snapshot is the default value, so SSR and hydration always agree. `useHydrated()` shows skeletons instead of briefly flashing "no data".
- **`src/lib/types.ts`**: the data model plus runtime guards (`parseApps`, `parsePrefs`). localStorage is user-editable, so corrupted or old data degrades gracefully instead of crashing.
- **`src/lib/jobs.ts`**: pure helpers for filtering and sorting, grouping, counting, demo data, and CSV export (with formula-injection protection).

```
src/
  app/            layout, home, tracker/, insights/, settings/, robots.ts, sitemap.ts,
                  icon1.ico, icon2.svg, apple-icon.png
  components/     site header/footer, theme-toggle, scroll-to-top, prefs-sync,
                  confirm-dialog, native-select, status-badge, stat-card,
                  pipeline-preview, tracker/, ui/ (shadcn)
  lib/            types, storage, jobs, scroll, site, utils
```

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

The canonical URL, sitemap and robots point at the GitHub Pages site from both deployments, so search engines treat it as the one primary site. To change the primary host, set `NEXT_PUBLIC_SITE_URL`.

## Fixes over the original

- Tailwind v4 theme tokens are mapped via `@theme inline`. In the original, `bg-primary`, `bg-background` and similar classes didn't resolve.
- No hydration mismatches: the original read localStorage during the initial render.
- Preferences propagate live. The original `PrefsSync` kept its own copy and only updated on reload.
- The saved default sort is actually applied on the Tracker page. In the original it was read before storage loaded.
- "Status" sort follows pipeline order instead of alphabetical order.
- Sitemap and robots URLs no longer contain a double slash.
- Insights bars show each status's share of the total, and the missing "Rejected" KPI is added.
- Factory reset really removes the keys. The original immediately wrote the defaults back.

## Deployment

- **Vercel** builds every push to `main` as a normal Next.js app.
- **GitHub Pages**: `.github/workflows/pages.yml` builds a static export on every push to `main` and deploys it to `https://ali-sazzad.github.io/job-track/`. The export is only switched on when `GITHUB_PAGES=true`, which sets `output: "export"`, `basePath: "/job-track"` and `trailingSlash` in `next.config.ts`, so it never affects Vercel. The app keeps all its data in the browser, so the static site works the same as the Vercel one. The two sites are separate origins, so each keeps its own saved data. To move data between them, use Export JSON on one and Import JSON on the other (Settings → Data).

To preview the Pages build locally:

```bash
GITHUB_PAGES=true npm run build   # writes ./out, served under /job-track/
```

> **Why `icon1.ico` rather than `favicon.ico`?** With a `basePath`, Next.js doesn't emit the `<link>` for `app/favicon.ico` (it only recognises the literal `/favicon.ico` URL), so the GitHub Pages build would lose it. The numbered `icon` convention is emitted correctly on both hosts.
