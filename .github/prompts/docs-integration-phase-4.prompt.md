---
mode: agent
description: 'Phase 4 of docs-integration: Create docs.scss SCSS entry with full import chain, rewrite astro.config.ts to use chassis() integration and remove base prefix.'
---

# Docs Integration Phase 4 — SCSS + Astro Config

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

**Reference files** (read all before writing):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/scss/docs.scss`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/astro.config.ts`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/scss/docs.scss`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/astro.config.ts`

## Goal

Replace the current hand-rolled inline CSS approach with:
1. Proper SCSS import chain consuming `@chassis-ui/docs/scss`
2. A clean `astro.config.ts` using the `chassis()` integration

## Steps

### 1. Create packages/site/src/scss/docs.scss

This is the SCSS entry point imported by `Head.astro` from `@chassis-ui/docs`.

```scss
// Chassis tokens for docs
@import "@chassis-ui/tokens/dist/web/docs/chassis/main";

// Shared docs settings (must come before chassis-css variables)
@import "@chassis-ui/docs/scss/settings";

// Chassis CSS foundation
@import "@chassis-ui/css/scss/settings";
@import "@chassis-ui/css/scss/functions";
@import "@chassis-ui/css/scss/tokens";
@import "@chassis-ui/css/scss/variables";
@import "@chassis-ui/css/scss/rfs";
@import "@chassis-ui/css/scss/maps";
@import "@chassis-ui/css/scss/mixins";
@import "@chassis-ui/css/scss/placeholders";

// Shared docs styles (sidebar, toc, navbar, code, syntax, docsearch, etc.)
@import "@chassis-ui/docs/scss/main";
```

Examine the exact content of the reference files — the import order matters. Some chassis-css partials may have changed names; verify against `/Volumes/Ozgur/Dropbox/Sites/chassis-css/scss/`.

### 2. Rewrite packages/site/astro.config.ts

The new config should:
1. Use `chassis()` integration (defined in `./src/libs/astro`)
2. Use `react()` from `@astrojs/react` (chassis-react specific)
3. Use `getSiteUrl(getConfig())` for the `site:` option
4. Remove `base: '/react/'` — routing is now handled via page directory structure
5. Remove `outDir` override (let Astro use the default, or set it to `../../_site` as before — check chassis-figma's outDir)
6. Remove the inline `rehypeStripIsRaw` plugin (now comes from `@chassis-ui/docs` via `chassis()`)
7. Remove `@astrojs/mdx` and `@astrojs/sitemap` from integrations array (chassis() adds them)
8. Remove the `@chassis-ui/css` Rollup external (CSS is now bundled via SCSS, not a CDN link)
9. Keep the `vite.css.preprocessorOptions.scss.silenceDeprecations` setting

Target structure:
```ts
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import { chassis } from './src/libs/astro'
import { getConfig } from './src/libs/config'
import { getSiteUrl } from '@chassis-ui/docs'

const site = getSiteUrl(getConfig())

export default defineConfig({
  outDir: '../../_site',
  integrations: [...chassis(), react()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
    // rehype/remark plugins are added by chassis()
  },
  site,
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
        }
      }
    }
  }
})
```

Note: `getSiteUrl` from `@chassis-ui/docs` reads the baseURL from the config and formats it correctly for Astro's `site:` option. Check `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/docs/src/libs/utils.ts` or the docs package index to find the `getSiteUrl` export.

### 3. Add Algolia plugin (optional, if already available)

Copy `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/plugins/algolia-plugin.js` to `packages/site/src/plugins/algolia-plugin.js`.

Add to astro.config.ts:
```ts
import { algoliaPlugin } from './src/plugins/algolia-plugin'
// in vite.plugins:
plugins: [algoliaPlugin()]
```

### 4. Remove inline styles from existing components

The hand-rolled components (Sidebar.astro, Toc.astro, DocsLayout.astro) will be deleted in Phase 5. No action needed here, but ensure the SCSS compiles without referencing them.

### 5. Verify env.d.ts

`packages/site/src/env.d.ts` should declare the `@libs/*` module references. Check if it needs updating:
```ts
/// <reference types="astro/client" />
/// <reference path="./types/auto-import.d.ts" />
```

## Verification

Run a build attempt after this phase. It may fail due to pages not yet updated (Phase 5), but it should NOT fail on SCSS compilation or astro.config import errors:

```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
pnpm --filter chassis-react-site astro check
```

Fix any TypeScript errors in astro.config.ts or the libs.

## Completion

Mark Phase 4 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.
