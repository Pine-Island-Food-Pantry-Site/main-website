# CLAUDE.md — Pine Island Food Pantry Website

This file provides context for AI assistants working on the Pine Island Food Pantry main website.

---

## Project Overview

This is the main website for **The Pine Island Food Pantry**, a non-profit organization providing food assistance in Pine Island, Florida. It is a Next.js application backed by Sanity CMS for content management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript 5 |
| CMS | Sanity v5 |
| Styling | Tailwind CSS v4 + CSS Modules |
| Linter/Formatter | Biome |
| Type checker | TypeScript (`tsc --noEmit`) |
| Contact form | Web3Forms + react-hook-form |
| Deployment | Vercel (primary), Netlify (secondary) |

---

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack enabled)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Biome linter check
npm run lint:fix     # Biome linter with auto-fix
npm run format       # Biome formatter
npm run type-check   # TypeScript type check (no emit)
```

> There is no test runner configured. Validate changes with `type-check` and `lint`.

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
├── types/index.ts                # Shared TypeScript interfaces / payload types
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

- Strict null checks are enabled; avoid `as any`.
- All Sanity payload shapes are typed in `types/index.ts`.
- Run `npm run type-check` to validate before committing.

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

- **Vercel** (primary): Connect repo, set env vars, deploy automatically on push to `main`.
- **Netlify** (alternative): `netlify.toml` configures the Sanity webhook trigger.
- TypeScript build errors are intentionally ignored in Vercel production builds (configured in `next.config.mjs`). Fix them locally with `npm run type-check`.

---

## Key Things to Avoid

- Do not import the Sanity client directly in page files — use `loadQuery`.
- Do not add `"use client"` to components unless they require browser APIs or event handlers.
- Do not create new CSS files unless necessary; prefer Tailwind utilities or extend an existing module.
- Do not skip `npm run type-check` and `npm run lint` before committing.
- Do not commit `.env.local` or any file containing secrets.
