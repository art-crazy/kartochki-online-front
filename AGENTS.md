# Project Guide For Coding Agents

Primary repo guide for the `kartochki.online` frontend. Use `docs/architecture.md` for details. Keep changes production-ready and avoid shortcuts that create migration debt.

## Product

- Brand/domain: `kartochki.online`, `kartochki-online.ru`
- Purpose: generate product-card visuals and content assets for marketplace sellers
- Constraint: SEO is first-class on the public website

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- SCSS Modules
- Jotai for lightweight client state

## Layers

- `src/app` - routing and framework integration only
- `src/views` - route-facing page compositions
- `src/widgets` - larger page sections and blocks
- `src/features` - user scenarios and actions
- `src/entities` - domain models and business types
- `src/shared` - shared infrastructure, providers, config, ui, state, and utilities

## Rules

- Keep route files thin, declarative, and free of business logic; route files should import page components from `src/views`.
- Treat `views` as the FSD page-equivalent because `src/pages` is reserved by Next.js.
- Put new code in the narrowest owning layer; prefer explicit slice boundaries over generic utility folders.
- Keep source files at 300 lines or fewer; if a file grows past that, split it within the same slice.
- Default to `SCSS Modules`; keep styles local unless they are true global tokens or resets.
- Reuse and progressively adapt the external HTML kit instead of introducing a second styling paradigm.
- Do not add Tailwind as a second primary styling system unless explicitly requested.
- Use Jotai for lightweight client UI state and cross-component state; keep atoms near the owning layer and never use Jotai as a server cache.
- If server-state is needed, add a dedicated async data solution instead of stretching atoms.
- Public pages should render meaningful server HTML; prefer static generation or server rendering for landing pages.
- Use Next metadata APIs for titles, descriptions, canonical URLs, Open Graph, `robots`, and `sitemap`.
- Do not hide indexable content behind client-only rendering.
- Migrate the external HTML kit incrementally into `views`, `widgets`, and `shared/ui`; do not dump large static HTML blobs into route files.
- Preserve semantic structure because it affects SEO quality.

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Change Discipline

1. Identify the correct FSD layer before creating files.
2. Keep route files minimal.
3. Decompose files instead of extending them past 300 lines.
4. Update `docs/architecture.md` when architecture decisions change.
5. Prefer small, reviewable changes over broad speculative abstractions.
