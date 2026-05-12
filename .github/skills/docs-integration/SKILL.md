---
name: docs-integration
description: 'Integrates chassis-react docs site with the shared Chassis UI documentation platform. USE FOR: adding vendor/assets submodule, wiring @chassis-ui/docs layouts/scss/components, aligning URL routing to /react/docs/ pattern, adding build scripts, creating homepage, or any phase of the docs-integration work. Invoke to resume after session interruption, check current phase status, or start the next phase.'
argument-hint: 'phase number or "status" to check current progress'
---

# Chassis React — Docs Integration Skill

Replaces the minimal hand-rolled Astro site (from the react-migration project) with a fully integrated Chassis documentation site, visually and structurally consistent with `chassis-figma`, `chassis-icons`, and `chassis-website`.

## How to Use This Skill

1. **Check status first** — read [phase-status.md](./references/phase-status.md) to see which phases are done
2. **Orient to codebase** — read [codebase-facts.md](./references/codebase-facts.md) for key paths and patterns
3. **Run the phase prompt** — each phase has a dedicated prompt in `.github/prompts/`
4. **Update phase status** — mark phase complete in [phase-status.md](./references/phase-status.md) when done

## Project Context

`chassis-react` is the React component library of the Chassis UI design system. A basic Astro docs site exists at `packages/site` from the react-migration project (phases 1–7 complete). That site builds and renders content but uses hand-rolled layouts, inline CSS, and no shared Chassis infrastructure.

This skill brings the site to full parity with all other Chassis docs sites.

### Repositories involved

| Repo | Role | Local path |
|------|------|------------|
| `chassis-react` | **This repo** — React library + docs site | `/Volumes/Ozgur/Dropbox/Sites/chassis-react` |
| `chassis-website` | **Primary pattern reference** — monorepo, `packages/website` | `/Volumes/Ozgur/Dropbox/Sites/chassis-website` |
| `chassis-figma` | **Secondary pattern reference** — standalone, `site/` | `/Volumes/Ozgur/Dropbox/Sites/chassis-figma` |
| `chassis-css` | CSS framework — link: dep source | `/Volumes/Ozgur/Dropbox/Sites/chassis-css` |
| `chassis-tokens` | Design tokens — link: dep source | `/Volumes/Ozgur/Dropbox/Sites/chassis-tokens` |
| `chassis-icons` | Icons — link: dep source | `/Volumes/Ozgur/Dropbox/Sites/chassis-icons` |
| `@chassis-ui/docs` | Shared layouts/components/SCSS | `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/docs` |
| `chassis-assets` | Brand assets (fonts, icons) — git submodule | `vendor/assets` (to be added at repo root) |

## Architecture Decisions

| Concern | Decision | Rationale |
|---------|----------|-----------|
| Pattern | Follow `chassis-website` (monorepo) over `chassis-figma` (standalone) | chassis-react is also a monorepo |
| `@chassis-ui/docs` | `pnpm link` local path for now | Can switch to npm version later |
| `@chassis-ui/css` | `pnpm link` local path | Already in use |
| `@chassis-ui/tokens` | `pnpm link` local path | Already in use |
| `@chassis-ui/icons` | `pnpm link` local path | Needed for icon sprites |
| URL routing | Directory-based (`src/pages/react/...`), no `base` config | Matches all other Chassis sites |
| `config.yml` location | `packages/site/config.yml` | cwd = packages/site when astro CLI runs via pnpm --filter |
| `vendor/assets` | git submodule at repo root, branch `app/docs` | Same as chassis-figma, chassis-icons, chassis-website |
| `docsDir` (in config.yml) | `"."` (packages/site is cwd at build time) | Same as chassis-website |
| `docsPath` | `"/react/docs"` | Canonical path on chassis-ui.com |
| `baseURL` | `"https://chassis-ui.com/react"` | Production hostname + base |
| Algolia | Same app/index as all other sites | Unified search across chassis-ui.com |
| `@astrojs/react` | Added alongside `chassis()` integration | Only chassis-react needs this |
| Example shortcode | `src/components/shortcodes/Example.astro` wrapping React island | Auto-imported via astro-auto-import |
| PropTable shortcode | `src/components/shortcodes/PropTable.astro` | Auto-imported |

## URL Structure

```
chassis-ui.com/            → redirect to /react/
chassis-ui.com/react/      → Home landing page (BaseLayout)
chassis-ui.com/react/docs/ → redirect to /react/docs/getting-started/introduction/
chassis-ui.com/react/docs/[...slug]/ → DocsLayout (from @chassis-ui/docs)
```

**Astro pages mapping:**
```
src/pages/index.astro                        → redirect to /react/
src/pages/react/index.astro                  → home (BaseLayout)
src/pages/react/docs/index.astro             → redirect to intro
src/pages/react/docs/[...slug].astro         → DocsLayout
src/pages/404.astro                          → 404 page
src/pages/robots.txt.ts                      → robots.txt (Vercel env aware)
```

## Phase Plan

See [phase-status.md](./references/phase-status.md) for current completion status.

| # | Phase | Prompt file |
|---|-------|-------------|
| 1 | Repo infrastructure (submodule + build scripts + root package.json) | [docs-integration-phase-1.prompt.md](../../prompts/docs-integration-phase-1.prompt.md) |
| 2 | Site package (package.json deps + config.yml + data/sidebar.yml + tsconfig) | [docs-integration-phase-2.prompt.md](../../prompts/docs-integration-phase-2.prompt.md) |
| 3 | Site libs (`src/libs/*` — config, path, astro integration, content, data, shortcode, etc.) | [docs-integration-phase-3.prompt.md](../../prompts/docs-integration-phase-3.prompt.md) |
| 4 | SCSS + astro.config (docs.scss import chain, rewrite astro.config.ts with chassis()) | [docs-integration-phase-4.prompt.md](../../prompts/docs-integration-phase-4.prompt.md) |
| 5 | Page routing restructure (/react/ directory pattern, delete old pages/layouts/components) | [docs-integration-phase-5.prompt.md](../../prompts/docs-integration-phase-5.prompt.md) |
| 6 | Shortcodes (migrate to src/components/shortcodes/, auto-import, React Example integration) | [docs-integration-phase-6.prompt.md](../../prompts/docs-integration-phase-6.prompt.md) |
| 7 | Homepage + static assets (home page, react-example.js, icon sprite, CNAME) | [docs-integration-phase-7.prompt.md](../../prompts/docs-integration-phase-7.prompt.md) |
| 8 | Build verification (full build, fix issues, algolia, fonts, sitemap) | [docs-integration-phase-8.prompt.md](../../prompts/docs-integration-phase-8.prompt.md) |

## Key File Locations (After Integration)

| File | Purpose |
|------|---------|
| `packages/site/config.yml` | Site configuration (title, baseURL, docsPath, algolia, etc.) |
| `packages/site/data/sidebar.yml` | Sidebar navigation structure |
| `packages/site/src/libs/config.ts` | Reads + validates config.yml |
| `packages/site/src/libs/path.ts` | FS path helpers (assets, CSS, icons, docs) |
| `packages/site/src/libs/astro.ts` | `chassis()` Astro integration |
| `packages/site/src/libs/content.ts` | Content collection exports |
| `packages/site/src/libs/data.ts` | YAML data file loader (sidebar.yml) |
| `packages/site/src/libs/shortcode.ts` | auto-import integration setup |
| `packages/site/src/scss/docs.scss` | SCSS entry — imports tokens + @chassis-ui/docs/scss + chassis-css |
| `packages/site/astro.config.ts` | Astro config using `chassis()` + `react()` |
| `packages/site/src/pages/react/docs/[...slug].astro` | Doc pages using DocsLayout |
| `packages/site/src/components/shortcodes/Example.astro` | React island example wrapper |
| `packages/site/src/components/shortcodes/PropTable.astro` | Prop table from api collection |
| `packages/site/static/static/js/react-example.js` | Client-side example interaction JS |
| `build/sync-submodules.js` | Syncs vendor/assets submodule |
| `build/change-version.js` | Bumps version across files |
| `build/vnu-jar.js` | HTML validation |
| `vendor/assets` | Git submodule — chassis-assets branch app/docs |
