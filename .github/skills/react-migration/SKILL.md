---
name: react-migration
description: 'Orchestrates the chassis-react modernization project. USE FOR: continuing the React 18 upgrade, migrating docs from Gatsby to Astro, building the new packages/site, creating the React Example island, migrating MDX content, setting up API docs generation, or any phase of the chassis-react migration. Invoke to resume after session interruption, check current phase status, or start the next phase.'
argument-hint: 'phase name or "status" to check current progress'
---

# Chassis React Migration Skill

Full modernization of the `chassis-react` package: React 17→18 library upgrade, monorepo tooling migration, and replacement of the Gatsby docs with an integrated Astro site consistent with the rest of the Chassis UI ecosystem.

## How to Use This Skill

1. **Check status first** — read [phase-status.md](./references/phase-status.md) to see which phases are done
2. **Orient to the codebase** — read [codebase-facts.md](./references/codebase-facts.md) for key locations and patterns
3. **Run the appropriate phase prompt** — each phase has a dedicated prompt in `.github/prompts/`
4. **Update phase status** — mark the phase complete in [phase-status.md](./references/phase-status.md) when done

## Project Context

`chassis-react` is the React component library of the Chassis UI design system, built on top of `chassis-css`. It was bootstrapped separately and has an old Gatsby-based docs site that needs to be replaced with an Astro site integrated into `chassis-ui.com/react/`, consistent with all other Chassis sub-sites.

### Repositories involved

| Repo | Role | Local path |
|------|------|------------|
| `chassis-react` | **This repo** — React library + new docs site | `/Volumes/Ozgur/Dropbox/Sites/chassis-react` |
| `chassis-website` | Main Astro site, pattern to follow | `/Volumes/Ozgur/Dropbox/Sites/chassis-website` |
| `chassis-css` | CSS framework dependency | `/Volumes/Ozgur/Dropbox/Sites/chassis-css` |
| `chassis-tokens` | Design tokens dependency | `/Volumes/Ozgur/Dropbox/Sites/chassis-tokens` |

## Architecture Decisions (Final)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| React version | 18 | Ecosystem alignment, concurrent features |
| `prop-types` | Remove during React 18 upgrade | TypeScript interfaces make them redundant |
| Monorepo tooling | Migrate from Lerna + Yarn → pnpm workspaces | Consistency with chassis-website and the rest of the ecosystem |
| Docs framework | Astro (standalone package in this repo) | Integrated with chassis-ui.com/react/, consistent with other sub-sites |
| Docs package location | `packages/site` (replaces `packages/docs`) | Clean slate; old Gatsby site is deleted entirely |
| Hosting URL | `chassis-ui.com/react/` | Canonical URL, `chassis-ui.io` is legacy/artifact |
| Deploy | Standalone Vercel deployment with Astro `base: '/react/'` | Matches pattern of other chassis sub-sites |
| Live component previews | React islands with `client:visible` | Astro island architecture for interactive components |
| API prop tables | Pre-build script (react-docgen-typescript → JSON) consumed as content collection | Better long-term; TSDoc comments already on all interfaces |
| MDX component scope | Explicit imports in each MDX file (MDX v3 requirement) | Required; Gatsby's implicit global scope is gone |

## Phase Plan

See [phase-status.md](./references/phase-status.md) for current completion status.

| # | Phase | Prompt file |
|---|-------|-------------|
| 1 | React 18 upgrade + prop-types removal + test migration | [react18-upgrade.prompt.md](../../prompts/react18-upgrade.prompt.md) |
| 2 | Monorepo: Lerna/Yarn → pnpm workspaces | [pnpm-migration.prompt.md](../../prompts/pnpm-migration.prompt.md) |
| 3 | Scaffold `packages/site` Astro site, delete `packages/docs` | [astro-site-scaffold.prompt.md](../../prompts/astro-site-scaffold.prompt.md) |
| 4 | Design + implement the `<ReactExample>` island | [react-example-island.prompt.md](../../prompts/react-example-island.prompt.md) |
| 5 | Migrate 25 MDX content files to MDX v3 | [mdx-content-migration.prompt.md](../../prompts/mdx-content-migration.prompt.md) |
| 6 | API docs generation (react-docgen-typescript → content collection) | [api-docs-generation.prompt.md](../../prompts/api-docs-generation.prompt.md) |
| 7 | Sidebar nav, Algolia search, deploy config, chassis-website integration | [nav-deploy-integration.prompt.md](../../prompts/nav-deploy-integration.prompt.md) |

## Quick Reference

### Key files in `packages/react`

```
src/
  index.ts                  — 90+ named exports (all Cx* components)
  components/
    Types.tsx               — shared prop types (Colors, Shapes, Triggers, etc.)
    button/CxButton.tsx     — representative simple component
    modal/CxModal.tsx       — representative complex component (portal, context, transitions)
    tooltip/CxTooltip.tsx   — uses react-popper (Manager/Popper/Reference)
    dropdown/CxDropdown.tsx — uses react-popper (Manager)
  utils/hooks.ts            — useForkedRef and other shared hooks
```

### Key files in `packages/docs` (OLD — to be deleted in Phase 3)

```
content/1.0/
  components/   — 25 MDX files (button.mdx, modal.mdx, etc.)
  forms/        — form component MDX files
  getting-started/
  layout/
  patterns/
src/components/
  Example.tsx   — simple wrapper div; to be replaced by ReactExample island
  Callout.tsx   — callout box component
```

### chassis-website Astro patterns to follow

```
packages/website/
  astro.config.ts           — Astro config with chassis() integration, Vite SCSS, Algolia
  src/
    content.config.ts       — Astro content collections (docsSchema, blogSchema)
    libs/astro.ts           — chassis() Astro integration
    libs/config.ts          — getConfig() helper
    pages/docs/[...slug].astro  — docs page template
    layouts/                — shared layouts
```
