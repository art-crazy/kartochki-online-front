# Architecture

## Purpose

This repository is the frontend for `kartochki.online`, a SEO-first SaaS product for marketplace sellers. It has two primary surfaces:

- A public marketing website that must rank well in search and scale to many landing pages.
- An authenticated application where users generate product-card visuals, manage templates, and work with marketplace assets.

The architecture should optimize for crawlable public pages, predictable growth, and clean separation between route wiring and business code.

## Core Stack

- `Next.js 16` with App Router
- `React 19`
- `TypeScript`
- `SCSS Modules`
- `Jotai`

## Why SCSS Modules

The product already has an HTML kit and page mockups. SCSS Modules are the most practical default:

- Existing HTML and CSS can be migrated incrementally.
- Marketing pages can preserve a custom visual identity without utility-class sprawl.
- Styles stay close to their components.
- There is no SEO advantage in using Tailwind, so styling should be chosen for implementation speed and maintainability.

Tailwind may be considered later for isolated internal tooling, but it should not become the main styling system unless the team makes that choice deliberately.

## Why Jotai

`Jotai` is a good fit for this project.

- It is small, composable, and easy to scale gradually.
- It works well for editor UI state, dialogs, local preferences, and cross-widget coordination.
- It avoids heavy global boilerplate.

Use Jotai for client state. Do not turn it into a server-cache layer.

## FSD-Oriented Structure

### `src/app`

Framework integration layer only.

- Route files
- Layouts
- Metadata files such as `robots.ts` and `sitemap.ts`
- Route groups for product surfaces
- Surface-specific layouts for marketing and authenticated areas

Route files should stay thin and delegate to `src/views`.

### `src/views`

Route-facing compositions assembled from widgets and features.

This repository uses `views` instead of the canonical FSD `pages` layer because `src/pages` is reserved by Next.js and would activate the legacy Pages Router.

Examples:

- Home page
- Pricing page
- Login page
- Dashboard page
- Template gallery page

### `src/widgets`

Large sections and blocks used to compose pages.

Examples:

- Hero
- Pricing table
- Feature grid
- Dashboard shell
- Editor sidebar

### `src/features`

Scenario-level user behavior and actions.

Examples:

- Sign in
- Start generation
- Upload product images
- Edit marketplace settings
- Export assets

### `src/entities`

Business entities and domain-focused types.

Examples:

- User
- Project
- ProductCard
- Template
- Marketplace
- GenerationJob

### `src/shared`

Cross-cutting infrastructure and low-level reusable code.

Examples:

- Providers
- Config
- UI primitives
- State atoms
- Helpers
- API transport

## Product Surfaces

### Marketing Surface

This surface exists for SEO, acquisition, and conversion.

In App Router it should live under a dedicated route group such as `src/app/(marketing)`.

Likely route families:

- `/`
- `/features/[slug]`
- `/marketplaces/[slug]`
- `/templates/[slug]`
- `/blog/[slug]`
- `/compare/[slug]`

Prefer static generation or server rendering and ensure these pages ship meaningful HTML.

### Application Surface

This surface exists for authenticated users.

In App Router it should live under a dedicated route group such as `src/app/(app)`.

Likely route families:

- `/app`
- `/app/projects`
- `/app/projects/[projectId]`
- `/app/templates`
- `/app/settings`

This area can be more interactive, but route composition should still live in `src/views`.

Authenticated routes should be `noindex` by default unless there is a specific reason to expose them to search engines.

Shared authenticated chrome such as sidebar navigation, mobile navigation, and the top app header should live in reusable widgets instead of being duplicated per route.

## SEO Rules

- Public pages should be indexable by default.
- Centralize site metadata in shared config.
- Use Next metadata APIs for canonical URLs, Open Graph, `robots`, and `sitemap`.
- Add structured data to high-intent pages when they are implemented.
- Avoid client-only rendering for indexable content.

## State Rules

- Use Jotai for lightweight client state.
- Keep atoms close to their owning slice.
- Promote atoms into `shared` only when they are truly cross-cutting.
- Keep remote data management outside Jotai.

## Styling Rules

- Use SCSS Modules as the default.
- Keep styles local to components.
- Put only true global tokens, resets, and primitives into global styles.
- Avoid introducing a second primary styling system without a documented reason.

## Suggested Near-Term Work

1. Add a shared UI primitive layer in `src/shared/ui`.
2. Migrate the external HTML kit into `views`, `widgets`, and `shared/ui`.
3. Add core entities for templates, projects, and generation jobs.
4. Build the marketing navigation and footer.
5. Add the authenticated workspace shell under `/app`.
