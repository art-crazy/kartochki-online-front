# Architecture

Frontend for `kartochki.online`, a SEO-first SaaS for marketplace sellers.

## Goals

- Public marketing pages must rank well, scale to many landing pages, and ship crawlable HTML.
- The authenticated app should stay interactive without mixing route wiring and business code.
- Growth should remain predictable through clear FSD ownership and thin route files.

## Core Stack

- `Next.js 16` App Router
- `React 19`
- `TypeScript`
- `SCSS Modules`
- `Jotai`

## Defaults

- Use `SCSS Modules`: they fit the existing HTML kit, keep styles close to components, preserve custom marketing UI without utility-class sprawl, and keep global styles limited to real tokens, resets, and primitives.
- Use `Jotai` for lightweight client state such as editor UI, dialogs, local preferences, and cross-widget coordination; do not use it as a server cache.
- Source files should stay at 300 lines or fewer; if a file grows past that, decompose it before adding more behavior or styles.
- Choose decomposition by FSD owner: split page compositions into smaller `views` fragments or `widgets`, split large widgets and features into local `ui`, `model`, and helper files, split large SCSS Modules into narrower modules or colocated partials in the same slice; generated files and binary assets are outside this rule.
- Do not introduce a second primary styling system unless the reason is documented.

## FSD Structure

- `src/app` - framework integration only: route files, layouts, metadata such as `robots.ts` and `sitemap.ts`, route groups, and surface-specific layouts; route files stay thin and delegate to `src/views`
- `src/views` - route-facing compositions assembled from widgets and features; this replaces the canonical FSD `pages` layer because `src/pages` would activate the legacy Pages Router
- `src/widgets` - large sections and blocks used to compose pages
- `src/features` - scenario-level user behavior and actions
- `src/entities` - business entities and domain-focused types
- `src/shared` - cross-cutting infrastructure and low-level reusable code

## API Layer

The API client is auto-generated from the backend OpenAPI spec via `@hey-api/openapi-ts`.

- Config: `openapi-ts.config.ts` reads `NEXT_PUBLIC_API_URL` from `.env.local`
- Generated code: `src/shared/api/generated/` - do not edit manually
- Client config: `src/shared/api/client.ts` sets `baseUrl` from env
- Public surface: `src/shared/api/index.ts` re-exports SDK functions, TanStack Query options factories, and domain types

### Regenerating

```bash
npm run generate:api
```

Backend must be running at `NEXT_PUBLIC_API_URL` when generating.

### Usage

```ts
// Server Component
import { getProjects } from '@/shared/api';
const { data } = await getProjects({ throwOnError: true });

// Client Component
import { useQuery } from '@tanstack/react-query';
import { listProjectsOptions } from '@/shared/api';
const { data } = useQuery(listProjectsOptions());
```

### Rules

- Import from `@/shared/api`, never from `@/shared/api/generated` directly.
- TanStack Query is for client components only; server components call SDK functions directly.
- Do not use Jotai as a cache for server data.

## Authentication

Authentication is implemented by calling the backend API directly through the generated client.

- Auth forms call generated SDK functions from `@/shared/api`.
- The API client uses `credentials: 'include'`, so browser-managed backend cookies are sent with API requests.
- Session state is checked through `GET /api/v1/me` via `getCurrentUserOptions`.
- Logout calls `POST /api/v1/auth/logout` via the generated SDK.
- Recovery flows such as `forgot-password` and `reset-password` call backend auth endpoints directly through the generated client.
- OAuth entry points should use backend endpoints directly, preserving provider redirects and backend-owned session handling.

Do not add a Next.js BFF auth layer unless the backend contract changes and the team explicitly decides to move session exchange into route handlers.

## Product Surfaces

### Marketing Surface

- Route group: `src/app/(marketing)`
- Likely route families: `/`, `/features/[slug]`, `/marketplaces/[slug]`, `/marketplaces/[slug]/tools/[toolSlug]`, `/marketplaces/[slug]/templates/[templateSlug]`, `/templates/[slug]`, `/blog/[slug]`, `/compare/[slug]`
- Prefer static generation or server rendering and ensure these pages ship meaningful HTML

### Application Surface

- Route group: `src/app/(app)`
- Likely route families: `/app`, `/app/projects`, `/app/projects/[projectId]`, `/app/templates`, `/app/settings`
- This area can be more interactive, but route composition should still live in `src/views`
- Authenticated routes should be `noindex` by default unless there is a specific reason to expose them to search engines
- Shared authenticated chrome such as sidebar navigation, mobile navigation, and the top app header should live in reusable widgets instead of being duplicated per route

## SEO Rules

- Public pages should be indexable by default.
- Centralize site metadata in shared config.
- Centralize internal linking rules for marketing pages instead of hardcoding random related links per route.
- Keep reusable metadata builders in `src/shared/seo` so route files stay declarative and consistent.
- Use Next metadata APIs for canonical URLs, Open Graph, `robots`, and `sitemap`.
- Add structured data to high-intent pages when they are implemented.
- Avoid client-only rendering for indexable content.

## Marketing Content Source

- Markdown content for public SEO pages lives in `content/marketing/`.
- Organize content by intent cluster, not by framework route internals:
  - `content/marketing/marketplaces/*.md`
  - `content/marketing/tools/*.md`
  - `content/marketing/templates/*.md`
  - `content/marketing/blog/*.md`
- Keep markdown parsing in shared infrastructure such as `src/shared/content/marketing`.
- Route-facing models in `src/views/*/model` and `src/entities/blog/model` should map markdown frontmatter into typed page models.
- Treat markdown as the source of truth for static marketing content; avoid duplicating the same titles, descriptions, and body copy in TS objects.
