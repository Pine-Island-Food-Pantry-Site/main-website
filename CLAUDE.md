# CLAUDE.md — Pine Island Food Pantry Website

This file provides context for AI assistants working on the Pine Island Food Pantry main website.

---

## Project Overview

This is the main website for **The Pine Island Food Pantry**, a non-profit organization providing food assistance in Pine Island, Florida. It is a Next.js application backed by Sanity CMS for content management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | Node.js 22.12+ |
| Language | TypeScript 7 (`tsc` CLI) |
| CMS | Sanity v6 (`sanity` 6.18) |
| Styling | Tailwind CSS v4 + CSS Modules |
| Linter/Formatter | Biome 2.5 |
| Type checker | TypeScript (`tsc --noEmit`), also run by `next build` |
| E2E tests | Playwright (`tests/e2e`) |
| Contact form | Web3Forms + react-hook-form |
| Deployment | Vercel (primary), Netlify (secondary) |

---

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack is the default bundler)
npm run build        # Production build (includes the tsc type check)
npm run start        # Start production server
npm run lint         # Biome linter check
npm run lint:fix     # Biome check with safe auto-fixes (--write); review the diff
npm run format       # Biome formatter
npm run type-check   # TypeScript type check (no emit)
npm run test:e2e     # Playwright end-to-end tests (tests/e2e)
```

> Validate changes with `type-check` and `lint`. Run `npm run test:e2e` after changes to pages, navigation, the contact form, or theme handling. Playwright starts `npm run dev` on `127.0.0.1:3000` unless CI is set; outside CI it reuses any server already on port 3000, so stop unrelated dev servers first.

---

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Google Fonts)
│   ├── (personal)/               # Route group: public-facing pages
│   │   ├── layout.tsx            # Navbar, Footer, Live Visual Editing
│   │   ├── page.tsx              # Home page
│   │   ├── about/page.tsx        # About page
│   │   ├── contact/page.tsx      # Contact form
│   │   ├── posts/page.tsx        # Post listing
│   │   ├── posts/[slug]/page.tsx # Individual post
│   │   └── [slug]/page.tsx       # Dynamic CMS pages
│   ├── studio/                   # Embedded Sanity Studio at /studio
│   └── api/
│       ├── draft/route.ts        # Enable Next.js draft mode
│       ├── disable-draft/route.ts
│       └── revalidate/route.ts   # ISR webhook from Sanity
├── components/
│   ├── global/                   # Navbar, Footer (with Preview variants)
│   ├── pages/                    # Page-level components + Preview variants
│   │   ├── home/
│   │   ├── post/
│   │   └── page/
│   └── shared/                   # Reusable UI: ImageBox, PortableText, Timeline
├── sanity/
│   ├── lib/
│   │   ├── api.ts                # Project ID, dataset, API version
│   │   ├── client.ts             # Sanity client
│   │   ├── queries.ts            # All GROQ queries
│   │   ├── token.ts              # API token for draft mode
│   │   └── utils.ts             # Image URL builder, route resolver
│   ├── loader/
│   │   ├── loadQuery.ts          # Server-side data fetching with draft mode
│   │   ├── generateStaticSlugs.ts
│   │   └── LiveVisualEditing.tsx # Client component for real-time preview
│   ├── schemas/
│   │   ├── documents/            # post.ts, page.ts
│   │   ├── objects/              # duration, milestone, timeline
│   │   └── singletons/           # home.ts, settings.ts
│   └── plugins/
│       ├── locate.ts             # Presentation tool location resolver
│       └── settings.tsx          # Singleton plugin helper
├── styles/
│   ├── index.css                 # Tailwind imports + CSS custom properties
│   └── *.module.css              # Page-scoped CSS modules
├── tests/e2e/                    # Playwright specs (site.spec.ts)
├── types/index.ts                # Shared TypeScript interfaces / payload types
├── next.config.mjs               # Next config (images, serverExternalPackages, taint)
├── playwright.config.ts          # E2E config (desktop + Pixel 5 projects)
└── public/                       # Static assets
```

---

## Sanity CMS

### Content Types

| Type | Kind | Description |
|---|---|---|
| `home` | Singleton | Home page content |
| `settings` | Singleton | Global nav, footer, SEO |
| `post` | Document | Blog/news posts |
| `page` | Document | General CMS pages |
| `duration` | Object | Date range (start/end) |
| `milestone` | Object | Timeline milestone entry |
| `timeline` | Object | Collection of milestones |

### GROQ Queries (sanity/lib/queries.ts)

- `homePageQuery` — Home page content
- `settingsQuery` — Global settings (nav, footer)
- `allPostsQuery` — All posts sorted DESC by date
- `latestPostQuery` — Most recent post
- `postBySlugQuery` — Single post by slug
- `pagesBySlugQuery` — Dynamic page by slug

### Draft / Preview Mode

- Enable at `/api/draft` (validates `SANITY_API_READ_TOKEN` + secret)
- Disable at `/api/disable-draft`
- Live visual editing is available in the Studio at `/studio`
- Each page component has a `*Preview.tsx` counterpart used in draft mode

### ISR (Incremental Static Revalidation)

- Sanity sends webhook to `/api/revalidate` on content publish
- Requires `SANITY_REVALIDATE_SECRET` env var
- Uses Next.js tag-based revalidation

---

## Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=          # usually 'production'

# Optional
SANITY_API_READ_TOKEN=               # Required for draft/preview mode
SANITY_API_WRITE_TOKEN=              # For content mutations (if needed)
SANITY_REVALIDATE_SECRET=            # Webhook secret for ISR
NEXT_PUBLIC_FORMS_ACCESS_KEY=        # Web3Forms key for contact form
NEXT_PUBLIC_SANITY_PROJECT_TITLE=    # Override Sanity Studio title
```

---

## Styling Conventions

- **Tailwind CSS v4** is the primary styling tool; use utility classes first.
- **CSS Modules** (`*.module.css`) are used for page-specific styles when needed.
- **Custom CSS properties** defined in `styles/index.css`:
  - `--btn-gradient`: green → cyan button gradient
  - `--bg-gradient`: yellow → orange background gradient
  - `--font-blue`: `#1b315e` (primary brand color)
  - `--nav-border`: `2px solid navy`
- Fonts loaded via Next.js Google Fonts in `app/layout.tsx`:
  - Serif: PT Serif
  - Sans: Inter
  - Mono: IBM Plex Mono

---

## Code Conventions

### File Naming

- Components: `PascalCase.tsx`
- Styles: `kebab-case.module.css`
- Utilities / lib: `camelCase.ts`
- GROQ queries: named exports in `sanity/lib/queries.ts`

### Component Patterns

- **Server Components** by default for all data-fetching pages.
- **Client Components** (`"use client"`) only where interactivity is required (forms, live preview, etc.).
- Each public-facing page component has a `*Preview.tsx` sibling used when draft mode is active.
- Use `dynamic()` with `{ suspense: true }` for preview components.
- Pass `encodeDataAttribute` prop down to elements that support Sanity visual editing overlays.

### TypeScript

- `strictNullChecks` is enabled (full `strict` mode is off); avoid `as any`.
- All Sanity payload shapes are typed in `types/index.ts`.
- Run `npm run type-check` to validate before committing. `next build` runs the same `tsc` check, so type errors fail the build.

### Linting & Formatting

- Biome is the single tool for both linting and formatting (replaces ESLint + Prettier).
- Style: **tabs**, **single quotes** (JS), **double quotes** (JSX), **no semicolons**.
- Exhaustive deps rule is enforced for hooks.
- Run `npm run lint:fix` to auto-fix most issues before committing.

---

## Data Fetching Pattern

All data fetching goes through `sanity/loader/loadQuery.ts`:

```ts
// Server Component example
const { data } = await loadQuery<PostPayload>(postBySlugQuery, { slug })
```

- Automatically switches to draft/live data when Next.js draft mode is active.
- Revalidation strategy is configured in `loadQuery.ts` (tag-based or time-based).
- Never import the Sanity client directly in page/component files; always use `loadQuery`.

---

## Deployment

- **Vercel** (primary): Connect repo, set env vars, deploy automatically on push to `main`. Set the project's Node.js version to 22.12 or newer; the repo does not pin one, and `sanity` 6.18, `@portabletext/react` 8, and `@sanity/visual-editing` 6 require it.
- **Netlify** (alternative): `netlify.toml` declares the Sanity incoming-hook template.
- TypeScript type errors fail production builds. `typescript.ignoreBuildErrors` is not set in `next.config.mjs`, so this applies on every host. Fix them locally with `npm run type-check` before pushing.

---

## Key Things to Avoid

- Do not import the Sanity client directly in page files — use `loadQuery`.
- Do not add `"use client"` to components unless they require browser APIs or event handlers.
- Do not create new CSS files unless necessary; prefer Tailwind utilities or extend an existing module.
- Do not skip `npm run type-check` and `npm run lint` before committing.
- Do not commit `.env.local` or any file containing secrets.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
