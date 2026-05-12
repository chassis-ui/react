---
mode: agent
description: 'Phase 5 of docs-integration: Restructure pages to /react/ directory pattern, remove old hand-rolled pages/layouts/components, add 404 and robots.txt.'
---

# Docs Integration Phase 5 — Page Routing Restructure

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

**Reference files** (read all before writing):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/pages/index.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/pages/figma/index.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/pages/figma/docs/index.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/pages/figma/docs/[...slug].astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/pages/robots.txt.ts`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/pages/docs/[...slug].astro`

## Goal

Restructure the pages directory to match the `/react/...` URL pattern. After this phase:
- `/` → redirect to `/react/`
- `/react/` → home landing page
- `/react/docs/` → redirect to first doc page
- `/react/docs/[...slug]/` → doc pages via DocsLayout from @chassis-ui/docs

## Steps

### 1. Create src/pages/index.astro

```astro
---
import RedirectLayout from '@chassis-ui/docs/layouts/RedirectLayout.astro'
---
<RedirectLayout path="/react/" />
```

### 2. Create src/pages/react/index.astro

A placeholder home page using `BaseLayout`. In Phase 7 this will be expanded with hero sections. For now, create a minimal page that links to docs:

```astro
---
import BaseLayout from '@chassis-ui/docs/layouts/BaseLayout.astro'
---
<BaseLayout title="Chassis React — React UI Component Library">
  <main class="container py-5">
    <h1>Chassis React</h1>
    <p class="lead">React component library built on Chassis CSS and design tokens.</p>
    <a href="/react/docs/" class="button primary">View Documentation</a>
  </main>
</BaseLayout>
```

### 3. Create src/pages/react/docs/index.astro

Redirect to the first documentation page:

```astro
---
import RedirectLayout from '@chassis-ui/docs/layouts/RedirectLayout.astro'
import { getChassisDocsPath } from '@libs/path'
---
<RedirectLayout path={getChassisDocsPath('/getting-started/introduction/')} />
```

### 4. Create src/pages/react/docs/[...slug].astro

This is the main docs page. Adapted from `chassis-figma/site/src/pages/figma/docs/[...slug].astro`:

```astro
---
import DocsLayout from '@chassis-ui/docs/layouts/DocsLayout.astro'
import { docsPages } from '@libs/content'
import type { CollectionEntry } from 'astro:content'
import { render } from 'astro:content'
import '@scss/docs.scss'

export async function getStaticPaths() {
  return docsPages.map((docsPage: CollectionEntry<'docs'>) => ({
    params: { slug: docsPage.id },
    props: docsPage
  }))
}

const docsPage = Astro.props
const { id, data } = docsPage
const frontmatter = data
const { Content, headings } = await render(docsPage)
---

<DocsLayout frontmatter={frontmatter} headings={headings} id={id}>
  <Content />
  <Fragment slot="scripts">
    <script is:inline src="/static/js/react-example.js"></script>
  </Fragment>
</DocsLayout>
```

Notes:
- No `components={{ }}` mapping — shortcodes are auto-imported by `chassis()` (Phase 6)
- The `@scss/docs.scss` import is the path alias pointing to `src/scss/docs.scss`
- `react-example.js` is a site-specific script added in Phase 7

### 5. Create src/pages/404.astro

```astro
---
import BaseLayout from '@chassis-ui/docs/layouts/BaseLayout.astro'
---
<BaseLayout title="Page Not Found" robots="noindex">
  <main class="container py-5 text-center">
    <h1>404</h1>
    <p>Page not found.</p>
    <a href="/react/">Back to home</a>
  </main>
</BaseLayout>
```

### 6. Create src/pages/robots.txt.ts

Copy and adapt from `chassis-website/packages/website/src/pages/robots.txt.ts`. Read the reference file for the exact content. The Vercel env detection logic should remain identical.

### 7. Delete old pages and components

Delete the following files (they are replaced by the new structure):
- `packages/site/src/pages/[...slug].astro` (replaced by `react/docs/[...slug].astro`)
- `packages/site/src/layouts/DocsLayout.astro` (replaced by @chassis-ui/docs DocsLayout)
- `packages/site/src/components/Sidebar.astro` (replaced by @chassis-ui/docs DocsSidebar)
- `packages/site/src/components/Toc.astro` (replaced by @chassis-ui/docs TableOfContents)
- `packages/site/src/data/nav.ts` (replaced by data/sidebar.yml)

Do NOT delete:
- `packages/site/src/components/ReactExample/` (still used)
- `packages/site/src/components/PropTable.astro` (will be moved in Phase 6)
- `packages/site/src/components/CalloutReact.tsx` (will be updated in Phase 6)
- `packages/site/src/components/Callout.astro` (check if it exists, update in Phase 6)

### 8. Update content.config.ts

The `docs` collection base path should remain as `'./content'` (relative path, works because Astro resolves from project root = packages/site/).

Update the `api` collection to use the proper schema aligned with `chassis-figma/site/src/content.config.ts` (the `docsSchema`).

The collection IDs will now be matched against `docsPath` in `getChassisDocsPath()`. Verify that:
- `docsPages[0].id` returns values like `getting-started/introduction`, `button`, `forms/overview`
- These match the sidebar.yml slug generation

## Verification

Run the build:
```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
pnpm --filter chassis-react-site astro build
```

Expected:
- Pages are generated under `_site/react/docs/*/`
- `_site/react/index.html` exists
- `_site/index.html` contains redirect to /react/
- No more `_site/[slug]/index.html` at root (old pattern)

There will likely be errors in Phase 5 because shortcodes aren't set up yet (Phase 6). Note them and proceed.

## Completion

Mark Phase 5 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.
