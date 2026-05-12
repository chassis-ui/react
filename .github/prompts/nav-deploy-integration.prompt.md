---
name: nav-deploy-integration
description: 'Phase 7 of chassis-react migration: implement sidebar navigation, Algolia search, deploy configuration, and chassis-ui.com/react/ integration. Final phase — run after Phase 6 (API docs generation) is complete.'
---

# Phase 7 — Navigation, Search, Deploy & Integration

**Prerequisite**: Phase 6 (API docs generation) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 6 = `[x]`  
**Completion marker**: Update Phase 7 status to `[x]` in phase-status.md — **migration complete**.

## Context

This is the final phase. It wires together the sidebar navigation (driven by content structure), Algolia search (consistent with chassis-website), the Vercel deploy config, and ensures the site appears correctly at `chassis-ui.com/react/`.

Before starting, read:
- `chassis-website/packages/website/src/pages/docs/[...slug].astro` — the full docs page layout
- `chassis-website/packages/website/astro.config.ts` — Algolia plugin usage
- Existing `vercel.json` at chassis-react repo root

## Step 1 — Design sidebar navigation data structure

The sidebar should mirror the content structure:

```ts
// packages/site/src/data/nav.ts
export const nav = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'getting-started/introduction' },
      { title: 'Installation', slug: 'getting-started/installation' },
    ]
  },
  {
    title: 'Layout',
    items: [
      { title: 'Grid', slug: 'layout/grid' },
      { title: 'Container', slug: 'layout/container' },
    ]
  },
  {
    title: 'Components',
    items: [
      { title: 'Accordion', slug: 'components/accordion' },
      { title: 'Badge', slug: 'components/badge' },
      // ... all 25 components ...
    ]
  },
  {
    title: 'Forms',
    items: [
      // form components
    ]
  }
]
```

Populate `items` based on the actual content files in `packages/site/content/`.

## Step 2 — Create `Sidebar.astro` component

Location: `packages/site/src/components/Sidebar.astro`

Follow `chassis-website/packages/website/src/components/` sidebar pattern. Key features:
- Render nav groups with headings
- Highlight active item based on current URL (`Astro.url.pathname`)
- All links must include the `/react/` base prefix (Astro handles this automatically via `base` config if you use relative URLs)

## Step 3 — Create `DocsLayout.astro`

Location: `packages/site/src/layouts/DocsLayout.astro`

Structure:
```astro
---
import Sidebar from '../components/Sidebar.astro'
import type { CollectionEntry } from 'astro:content'

interface Props {
  entry: CollectionEntry<'docs'>
}
const { entry } = Astro.props
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>{entry.data.title} — Chassis React</title>
    <!-- Link chassis CSS bundle -->
    <!-- Link docs CSS -->
  </head>
  <body>
    <header><!-- top nav --></header>
    <div class="container-fluid">
      <div class="row">
        <aside class="col-md-3">
          <Sidebar currentSlug={entry.id} />
        </aside>
        <main class="col-md-9">
          <h1>{entry.data.title}</h1>
          <slot />
        </main>
      </div>
    </div>
  </body>
</html>
```

Copy the full header/nav structure from `chassis-website/packages/website/src/layouts/` for consistency.

## Step 4 — Complete `src/pages/[...slug].astro`

```astro
---
import { getCollection, render } from 'astro:content'
import DocsLayout from '../layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const docs = await getCollection('docs')
  return docs.map((entry) => ({
    params: { slug: entry.id },
    props: { entry }
  }))
}

const { entry } = Astro.props
const { Content } = await render(entry)
---
<DocsLayout entry={entry}>
  <Content />
</DocsLayout>
```

## Step 5 — Complete `src/pages/index.astro`

The index page should redirect to `getting-started/introduction` or show a landing page. Follow `chassis-website` pattern for the root docs index.

## Step 6 — Add Table of Contents

If content pages have `toc: true` in frontmatter, render a right-hand TOC. Follow `chassis-website/packages/website/src/components/Toc` pattern. The `@chassis-ui/docs` package may provide TOC utilities.

## Step 7 — Configure Algolia Search

Follow `chassis-website/packages/website/src/plugins/algolia-plugin.ts`:

1. Add `algoliaPlugin()` to `astro.config.ts` `vite.plugins`
2. Configure with the chassis-react Algolia index (check with team for index name)
3. Add the Algolia search widget to the site header

Environment variables needed (add to Vercel project settings):
- `PUBLIC_ALGOLIA_APP_ID`
- `PUBLIC_ALGOLIA_SEARCH_KEY`
- `ALGOLIA_WRITE_KEY` (for indexing during build)

## Step 8 — Configure Vercel deployment

Check existing `vercel.json` at chassis-react repo root. Update or create:

```json
{
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "_site",
  "installCommand": "pnpm install",
  "framework": null
}
```

The site will be deployed as a static site. Routing is handled by Astro's static generation with `base: '/react/'`.

**Integration with chassis-ui.com**: The main chassis-ui.com site needs a rewrite rule to proxy `/react/*` to this deployment. Check `chassis-website/vercel.json` for the existing rewrite pattern and add the React docs entry:

```json
{
  "rewrites": [
    { "source": "/react/:path*", "destination": "https://chassis-react.vercel.app/react/:path*" }
  ]
}
```

(Coordinate with chassis-website repo for this change.)

## Step 9 — Add `public/` static files

Create `packages/site/public/`:
- `CNAME` — if custom domain is used at the Vercel project level
- `robots.txt`
- Any other static assets

## Step 10 — Full build verification

```sh
# From repo root
pnpm docs:build

# Verify output
ls _site/
ls _site/react/          # should contain index.html and all doc pages
ls _site/react/components/
```

Check `_site/react/components/button/index.html` exists and contains expected content.

## Step 11 — Smoke test with `pnpm docs:preview`

```sh
pnpm --filter @chassis-ui/react-site preview
```

Open `http://localhost:4321/react/` and verify:
- [ ] Index page loads
- [ ] Sidebar navigation renders
- [ ] Navigate to a component page — content renders
- [ ] Live component preview is interactive after scroll
- [ ] Prop table renders
- [ ] No broken links in navigation
- [ ] Code blocks are syntax highlighted

## Step 12 — Final cleanup

- [ ] Remove any debug or test pages added during development
- [ ] Ensure all `console.warn` / debug output is cleaned up
- [ ] Verify `packages/react/build/generate-api.ts` is documented in repo README
- [ ] Update root `README.md` with new commands (`pnpm docs:dev`, `pnpm docs:build`)

## Step 13 — Mark complete

Update phase-status.md Phase 7 to `[x]`.

Add a completion note to phase-status.md:
```
## Migration Complete — 2026-xx-xx
All 7 phases complete. Site live at chassis-ui.com/react/.
```

## Verification Checklist

- [ ] `pnpm docs:build` completes without errors
- [ ] `_site/react/` output is complete
- [ ] Sidebar navigation covers all content sections
- [ ] Active nav item is highlighted correctly
- [ ] All component pages load with live previews
- [ ] Prop tables render for all components
- [ ] Algolia search is configured (even if not fully indexed yet)
- [ ] `vercel.json` is configured for static output
- [ ] chassis-website rewrite rule is added for `/react/*`
- [ ] Root `README.md` updated with new commands
