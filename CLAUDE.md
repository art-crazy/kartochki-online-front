# Claude Project Instructions

This file is intended for Claude-style coding agents working in this repository.

## Start Here

- Read `AGENTS.md` first.
- Use `docs/architecture.md` for deeper rationale and examples.

## Mission

Build and maintain the frontend for `kartochki.online`, a SEO-first SaaS platform for marketplace sellers.

## Non-Negotiables

- Respect the FSD-oriented structure.
- Keep Next.js App Router usage inside `src/app`.
- Keep route files thin and delegate to `src/views`.
- Use `SCSS Modules` as the default styling approach.
- Use `Jotai` for lightweight client state only.
- Preserve SEO quality on public pages.
- Treat `src/views` as the FSD page-equivalent because `src/pages` is reserved by Next.js.

## Product Surfaces

- Public marketing surface:
  - SEO-sensitive
  - content and landing-page oriented
  - should render crawlable HTML
- Authenticated app surface:
  - interaction-heavy
  - workspace and editor oriented
  - can use more client-side behavior

## HTML Kit Migration

- The team has an HTML kit with all pages and core UI pieces.
- Translate it into React components gradually.
- Extract reusable blocks into widgets or shared UI primitives.
- Do not dump static markup into route files.

## Implementation Defaults

- TypeScript-first
- server-rendered public pages
- local SCSS module per component
- shared config for metadata and site constants
- minimal and explicit state

## Update Rule

If your changes affect architecture, rendering strategy, or layer boundaries, update `docs/architecture.md`.
