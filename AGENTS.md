# Project Guide For Coding Agents

This repository contains the frontend for `kartochki.online`, a SEO-first SaaS product for marketplace sellers.

## Read This First

- Use this file as the high-signal entry point.
- Use `docs/architecture.md` for deeper architectural context.
- Keep changes production-ready. Avoid prototype shortcuts that create migration debt.

## Product Context

- Primary domains:
  - `kartochki-online.ru`
  - `xn----7sbabjowfpen9ag6h.xn--p1ai`
- Brand name: `kartochki.online`
- The product helps users generate product-card visuals and content assets for marketplace listings.
- SEO is a first-class concern for the public website.

## Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- SCSS Modules
- Jotai for client state

## FSD Layers

- `src/app`
  - Next.js routing layer only
- `src/views`
  - route-facing page compositions
- `src/widgets`
  - larger page sections and blocks
- `src/features`
  - user scenarios and actions
- `src/entities`
  - domain models and business types
- `src/shared`
  - shared infrastructure, providers, config, ui, state, and utilities

## Architecture Rules

- Keep route files thin and declarative.
- Route files should import page components from `src/views`.
- Do not place business logic directly in `src/app`.
- Prefer explicit slice boundaries over generic utility folders.
- Put new code in the narrowest layer that owns it.
- Use `views` as the FSD page-equivalent because `src/pages` is reserved by Next.js.

## Styling Rules

- Default to `SCSS Modules`.
- Keep styles local to components unless they are truly global tokens or resets.
- Reuse and progressively adapt the external HTML kit instead of rewriting it into a second styling paradigm.
- Do not introduce Tailwind as a second primary styling system unless explicitly requested.

## State Rules

- Use Jotai for client UI state and light cross-component state.
- Keep atoms close to the owning layer.
- Do not use Jotai as a server cache.
- If server-state is needed, add a dedicated async data solution instead of stretching atoms.

## SEO Rules

- Public pages should render meaningful server HTML.
- Prefer static generation or server rendering for landing pages.
- Use Next metadata APIs for titles, descriptions, canonical URLs, Open Graph, `robots`, and `sitemap`.
- Do not hide indexable content behind client-only rendering.

## HTML Kit Migration

- The project will receive an HTML kit with all pages and UI building blocks.
- Migrate it incrementally into `views`, `widgets`, and `shared/ui`.
- Avoid copying large static HTML blobs into route files.
- Preserve semantic structure where possible because it affects SEO quality.

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Change Discipline

1. Identify the correct FSD layer before creating files.
2. Keep route files minimal.
3. Update `docs/architecture.md` when architecture decisions change.
4. Prefer small, reviewable changes over broad speculative abstractions.
