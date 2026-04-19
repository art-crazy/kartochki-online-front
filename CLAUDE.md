# Claude Project Instructions

Read `AGENTS.md` first. Use `docs/architecture.md` for API/auth details and surface-specific rules.

## Non-Negotiables

- Keep Next.js App Router usage inside `src/app`.
- Keep route files thin and delegate to `src/views`.
- Treat `src/views` as the FSD page-equivalent because `src/pages` is reserved by Next.js.
- Keep public pages crawlable and SEO-safe.

If your changes affect architecture, rendering strategy, or layer boundaries, update `docs/architecture.md`.
