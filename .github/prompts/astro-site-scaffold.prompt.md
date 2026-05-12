---
name: astro-site-scaffold
description: 'Phase 3 of chassis-react migration: delete packages/docs (old Gatsby site), create packages/site (new Astro site), configure it following the chassis-website pattern. Run after Phase 2 (pnpm migration) is complete.'
---

# Phase 3 — Scaffold `packages/site` (Astro), Delete `packages/docs`

**Prerequisite**: Phase 2 (pnpm migration) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 2 = `[x]`  
**Completion marker**: Update Phase 3 status to `[x]` in phase-status.md

## Context

Read [codebase-facts.md](../skills/react-migration/references/codebase-facts.md) — specifically the "chassis-website Astro Patterns to Follow" section.

The new `packages/site` will:
- Use Astro with `@astrojs/react` for component islands
- Mirror the structure of `chassis-website/packages/website`
- Serve at `chassis-ui.com/react/` (Astro `base: '/react/'`)
- Use `@chassis-ui/css` and `@chassis-ui/react` as workspace deps
- Output to `../../_site` (repo root `_site/`)

## Step 1 — Delete `packages/docs`

```sh
rm -rf /Volumes/Ozgur/Dropbox/Sites/chassis-react/packages/docs
```

Confirm the content MDX files have been **copied first** (Phase 5 migrates them — just confirm they're noted in phase-status.md before deleting if Phase 5 hasn't run yet).

Actually: **do not delete `packages/docs` until MDX content is migrated** to `packages/site/content/`. Coordinate with Phase 5: either copy content as part of this phase, or preserve `packages/docs/content/` until Phase 5 is done. The recommended approach is to copy `packages/docs/content/1.0/` → `packages/site/content/` now as raw files, then process them in Phase 5.

## Step 2 — Create `packages/site/package.json`

```json
{
  "name": "@chassis-ui/react-site",
  "version": "1.0.0",
  "private": true,
  "description": "Chassis React documentation site",
  "homepage": "https://chassis-ui.com/react/",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "clean": "rimraf ../../_site .astro"
  },
  "dependencies": {
    "@chassis-ui/react": "workspace:*",
    "@chassis-ui/css": "link:../../../chassis-css",
    "@chassis-ui/tokens": "link:../../../chassis-tokens",
    "@chassis-ui/docs": "latest"
  },
  "devDependencies": {
    "@astrojs/mdx": "latest",
    "@astrojs/react": "latest",
    "@astrojs/sitemap": "latest",
    "astro": "latest",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "rimraf": "latest",
    "sass": "latest",
    "typescript": "^5.0.0"
  }
}
```

Note: use exact versions aligned with `chassis-website/packages/website/package.json`.

## Step 3 — Create `packages/site/astro.config.ts`

Follow `chassis-website/packages/website/astro.config.ts` as the template. Key differences for the React site:

```ts
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import { chassis } from '@chassis-ui/docs/astro'  // verify exact import path
import { rehypeStripIsRaw } from '@chassis-ui/docs'

export default defineConfig({
  base: '/react/',
  outDir: '../../_site',
  build: {
    assets: 'static'
  },
  integrations: [
    react(),
    mdx(),
    chassis()  // if available; otherwise replicate needed features manually
  ],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
    rehypePlugins: [rehypeStripIsRaw]
  },
  site: 'https://chassis-ui.com',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
        }
      }
    },
    build: {
      rollupOptions: {
        external: ['@chassis-ui/css'],
        output: {
          paths: {
            '@chassis-ui/css': '/react/static/js/chassis.bundle.min.js'
          }
        }
      }
    }
  }
})
```

**Important**: Before writing this file, read the actual `chassis-website/packages/website/astro.config.ts` to get the exact current import paths and plugin usage.

## Step 4 — Create `packages/site/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", ".astro/**/*"]
}
```

## Step 5 — Create directory structure

```
packages/site/
  astro.config.ts
  package.json
  tsconfig.json
  public/           — static assets (robots.txt, CNAME etc.)
  content/          — MDX content files (populated in Phase 5)
    components/
    forms/
    getting-started/
    layout/
    patterns/
  src/
    content.config.ts   — Astro content collection schema
    env.d.ts
    layouts/
      DocsLayout.astro
    components/
      ReactExample/     — created in Phase 4
      Callout.astro
      PropTable.astro   — created in Phase 6
    pages/
      index.astro
      [...slug].astro
    scss/
      docs.scss
```

## Step 6 — Create `src/content.config.ts`

Extend the `docsSchema` from `chassis-website` or define it inline:

```ts
import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const reactDocsSchema = z.object({
  title: z.string(),
  description: z.string(),
  added: z.object({
    version: z.string(),
    show_badge: z.boolean().optional()
  }).optional(),
  toc: z.boolean().optional(),
  sections: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional()
  }).array().optional()
})

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: '../content' }),
    schema: reactDocsSchema
  })
}
```

## Step 7 — Create minimal `src/pages/index.astro` and `[...slug].astro`

Create stubs that render. These will be fleshed out in Phase 7. For now, just enough to confirm the site builds.

## Step 8 — Create `src/env.d.ts`

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

## Step 9 — Add to `pnpm-workspace.yaml`

`packages/site` is already covered by `packages/*` glob — no changes needed.

## Step 10 — Copy MDX content (staging for Phase 5)

```sh
cp -r packages/docs/content/1.0/* packages/site/content/
```

Now it is safe to delete `packages/docs`:
```sh
rm -rf packages/docs
```

## Step 11 — Install and verify

```sh
pnpm install
pnpm --filter @chassis-ui/react-site dev
```

The dev server should start without errors (even with stub pages).

## Step 12 — Mark complete

Update phase-status.md Phase 3 to `[x]`.

## Verification Checklist

- [ ] `packages/docs` is deleted
- [ ] `packages/site/package.json` exists with name `@chassis-ui/react-site`
- [ ] `packages/site/astro.config.ts` has `base: '/react/'` and `outDir: '../../_site'`
- [ ] `packages/site/src/content.config.ts` defines a docs collection
- [ ] `pnpm install` succeeds
- [ ] `pnpm --filter @chassis-ui/react-site dev` starts without errors
- [ ] `pnpm --filter @chassis-ui/react-site build` produces `_site/` output
