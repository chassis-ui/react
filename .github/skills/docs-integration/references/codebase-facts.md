# Codebase Facts — Chassis React Docs Integration

## Key Paths

| Path | Description |
|------|-------------|
| `/Volumes/Ozgur/Dropbox/Sites/chassis-react` | Repo root |
| `packages/react/` | React 18 component library (DO NOT modify) |
| `packages/site/` | Astro docs site |
| `packages/site/content/` | 43 MDX docs files (migrated from Gatsby) |
| `packages/site/content/api/` | 102 JSON prop files (generated) |
| `packages/site/src/examples/` | 40+ React example `.tsx` files |
| `build/` | Build scripts (to be created) |
| `vendor/assets/` | Git submodule — chassis-assets branch app/docs (to be added) |
| `_site/` | Built output (Astro writes here) |

## Pattern Reference Sites

| Site | Path | Monorepo? | astro --root usage |
|------|------|-----------|-------------------|
| `chassis-website` | `/Volumes/Ozgur/Dropbox/Sites/chassis-website` | Yes (packages/*) | `pnpm --filter chassis-website astro dev` |
| `chassis-figma` | `/Volumes/Ozgur/Dropbox/Sites/chassis-figma` | No (site/) | `astro dev --root site` |
| `chassis-icons` | `/Volumes/Ozgur/Dropbox/Sites/chassis-icons` | No (site/) | `astro dev --root site` |
| `@chassis-ui/docs` | `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/docs` | (package inside website) | n/a |

**chassis-react is a monorepo** → follow `chassis-website` pattern for all scripts and paths.

## Process.cwd() When Astro Runs

- When `pnpm --filter @chassis-ui/react-site astro dev` runs, Astro executes from within `packages/site/` so `process.cwd()` = `packages/site/`
- All path helpers (`getDocsFsPath`, etc.) resolve relative to `packages/site/`
- `config.yml` is read from `packages/site/config.yml`
- `../../vendor/assets/` from `packages/site/` = repo root `vendor/assets/`

## Local Package Links

All local packages are linked via pnpm `link:` paths. The root `package.json` and `packages/site/package.json` both declare links:

```json
"@chassis-ui/css": "link:../../../chassis-css",
"@chassis-ui/tokens": "link:../../../chassis-tokens",
"@chassis-ui/docs": "link:../../../chassis-website/packages/docs",
"@chassis-ui/icons": "link:../../../chassis-icons"
```

Note: `link:` paths are relative to the declaring package's directory.

## config.yml Keys Used by @chassis-ui/docs

The `@chassis-ui/docs` package's `@libs/config` alias points to the local `src/libs/config.ts` (not the one inside `@chassis-ui/docs`). The config schema must include all fields:

```yaml
title: "Chassis React"
baseURL: "https://chassis-ui.com/react"
docsDir: "."               # relative to cwd (packages/site/)
docsPath: "/react/docs"    # URL prefix for all doc pages
subtitle: "React Component Library for Chassis UI"
description: "..."
authors: "Ozgur Gunes"
current_version: "0.1.0"
github_org: "https://github.com/chassis-ui"
repo: "https://github.com/chassis-ui/react"
x: "chassis_ui"
analytics:
  google_id: "G-QGR8C28VYN"
algolia:
  app_id: "TMI5N9J6TZ"
  api_key: "e318e0636b0a951e4f82c8283345df13"
  index_name: "chassis-docs"
anchors:
  min: 2
  max: 5
toc:
  min: 2
  max: 6
blog:
  pageSize: 10
```

## @chassis-ui/docs Path Aliases

`@chassis-ui/docs` uses these internal aliases (defined in its own tsconfig, resolved by Astro):
- `@libs/*` → `src/libs/*` (inside the local site, e.g. `packages/site/src/libs/`)
- `@scss/*` → `src/scss/*`
- `@shortcodes/*` → `src/components/shortcodes/*`

The local site's `tsconfig.json` must declare these same aliases pointing to the local paths.

## chassis() Astro Integration

`chassis()` is defined in `packages/site/src/libs/astro.ts`. It returns an array of Astro integrations:
1. `chassisAutoImport()` — astro-auto-import for shortcodes
2. Named `'chassis-integration'` — rehype/remark plugins, static asset copy hooks, sitemap post-process
3. `mdx()` — @astrojs/mdx
4. `sitemap({ filter })` — @astrojs/sitemap

In `astro.config.ts`, `chassis()` is spread alongside `react()`:
```ts
integrations: [...chassis(), react()]
```

## Static Asset Copy (what chassis() does at build time)

1. `cleanPublicDirectory()` — removes `packages/site/public/`
2. `copyChassisAssets()` — copies `vendor/assets/dist/web/docs/chassis/` → `packages/site/public/static/`
3. `copyChassisCSS()` — copies `node_modules/@chassis-ui/css/dist/` → `packages/site/public/static/`
4. `copyChassisIcons()` — copies icon SVGs from `@chassis-ui/icons` → `packages/site/public/icons/`
5. `copyStatic()` — copies `packages/site/static/` → `packages/site/public/`
6. `aliasStatic()` — symlinks apple-touch-icon.png, favicon.ico

## Sidebar Data Structure (sidebar.yml)

```yaml
- title: Getting Started
  pages:
    - title: Introduction

- title: Layout
  pages:
    - title: Breakpoints
    - title: Containers
    - title: Grid
    - title: Columns
    - title: Gutters

- title: Components
  pages:
    - title: Accordion
    # ... (25 components)

- title: Forms
  pages:
    - group: Overview
      pages:
        - title: Overview
    # ... (9 pages)

- title: Patterns
  pages:
    - title: Dashboard Widgets
    - title: Form Processing
    - title: Paginated Table
```

The `DocsSidebar.astro` from `@chassis-ui/docs` calls `getData('sidebar')` to load this. Slugs are generated via `github-slugger` from titles. The URL is `{docsPath}/{groupSlug}/{pageSlug}`.

## Content Collection (content.config.ts)

After integration, the `docs` collection slug format matches `docsPath`:
- `getting-started/introduction` → URL: `/react/docs/getting-started/introduction/`
- `button` → URL: `/react/docs/button/`
- `forms/overview` → URL: `/react/docs/forms/overview/`

The `api` collection (prop tables) remains as before.

## React-Specific Additions

### Example Shortcode
`src/components/shortcodes/Example.astro` is site-specific (other sites use HTML examples, we use React islands). It wraps the existing ReactExample/ExamplePreview.tsx island.

It is auto-imported via `shortcode.ts` alongside `@chassis-ui/docs` shortcodes.

### PropTable Shortcode  
`src/components/shortcodes/PropTable.astro` — queries `api` collection and renders a table. Auto-imported.

### No `components={{ }}` mapping needed in [...slug].astro
After Phase 6, shortcodes are auto-imported globally. The MDX files use `<Example>` and `<PropTable>` without any explicit import because astro-auto-import handles it.

## Current State (before docs-integration)

The following already exist from react-migration phases 1-7:
- `packages/site/src/layouts/DocsLayout.astro` — hand-rolled, to be deleted
- `packages/site/src/components/Sidebar.astro` — hand-rolled, to be deleted
- `packages/site/src/components/Toc.astro` — hand-rolled, to be deleted
- `packages/site/src/data/nav.ts` — to be deleted
- `packages/site/src/pages/[...slug].astro` — to be moved to `react/docs/[...slug].astro`
- `packages/site/src/pages/index.astro` — to be replaced (currently just redirects to getting-started/introduction directly)

## Existing MDX Content Notes

All 43 MDX files are in `packages/site/content/` and use:
- `<Example>` components — mapped to `ExampleWrapper.astro` currently, will use auto-imported `Example.astro`
- `<Callout>` components — currently `CalloutReact.tsx`, will use `@chassis-ui/docs` `Callout.astro`
- `<PropTable>` components — already working, will be auto-imported
- No `[[config:...]]` or `[[docsref:...]]` patterns (Gatsby content was plain MDX)

## Algolia Plugin

Copy `packages/site/src/plugins/algolia-plugin.js` from `chassis-figma/site/src/plugins/algolia-plugin.js`. The plugin indexes docs pages during build.

## Root package.json Scripts (target state)

```json
{
  "scripts": {
    "build": "pnpm site:build",
    "clean": "pnpm site:clean",
    "dev": "pnpm sync-submodules && pnpm astro:dev",
    "preview": "pnpm astro:preview",
    "site": "pnpm site:build && pnpm site:lint:vnu",
    "site:build": "pnpm sync-submodules && pnpm astro:build",
    "site:clean": "rm -rf _site packages/site/node_modules packages/site/.astro packages/site/public",
    "astro:dev": "pnpm --filter chassis-react-site astro dev --port 4327",
    "astro:build": "pnpm --filter chassis-react-site astro build",
    "astro:preview": "pnpm --filter chassis-react-site astro preview",
    "api:generate": "ts-node --project build/tsconfig.json build/generate-api.ts",
    "lib:build": "pnpm --filter @chassis-ui/react build",
    "lint": "eslint \"packages/**/src/**/*.{js,ts,tsx}\"",
    "test": "jest --coverage",
    "test:update": "jest --coverage --updateSnapshot",
    "change-version": "node build/change-version.js",
    "sync-submodules": "node build/sync-submodules.js",
    "check": "pnpm check:pnpm",
    "check:pnpm": "pnpm audit --audit-level moderate"
  }
}
```

Note: The `docs:build` and `docs:dev` aliases from react-migration are replaced by `build`/`dev`/`site:build` to match the pattern of all other chassis sites.
