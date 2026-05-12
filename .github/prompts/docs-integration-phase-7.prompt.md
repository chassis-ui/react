---
mode: agent
description: 'Phase 7 of docs-integration: Build the homepage with hero section and features, create react-example.js for interactive React previews, ensure static assets are in place.'
---

# Docs Integration Phase 7 — Homepage + Static Assets

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

**Reference files** (read all before writing):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/pages/figma/index.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/components/homepage/`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/static/static/js/example-mode.js`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/pages/index.astro`

## Goal

Complete the front-facing experience:
1. A proper homepage with hero and feature sections
2. The `react-example.js` script for interactive example mode on doc pages
3. CNAME file and any other required static assets

## Steps

### 1. Create react-example.js

Create `packages/site/static/static/js/react-example.js`.

This script enables interactive mode for React component examples on doc pages. Adapt from `chassis-figma/site/static/static/js/example-mode.js`.

Key differences for chassis-react:
- React examples may have multiple render modes (e.g., "preview", "code")
- The script may toggle between showing rendered React output and JSX source code
- Copy the toggle/interactive logic but adjust selectors to match `cxd-example` class naming

Read the figma version carefully before adapting. If it references Figma-specific classes, replace with React docs equivalents.

If the existing MDX content doesn't use interactive example modes, create a minimal placeholder script:
```js
// Chassis React — Example Mode
// Enables interactive mode toggling for React component previews
;(function () {
  'use strict'
  // Initialize example interactions
  document.querySelectorAll('.cxd-example').forEach(function (el) {
    el.addEventListener('click', function () {
      // Reserved for future interactive example behavior
    })
  })
})()
```

### 2. Create Homepage Components

**Create src/components/homepage/Hero.astro**

Examine `chassis-figma/site/src/components/homepage/` for structure inspiration. The Hero section for chassis-react should include:
- Library name and version badge
- Tagline: "Production-ready React components for the Chassis Design System"
- Two CTAs: "Get Started" → `/react/docs/` and "View on GitHub" → `https://github.com/chassis-ui/chassis-react`
- Perhaps a code snippet showing installation

```astro
---
import { getConfig } from '@libs/config'
const config = getConfig()
---
<section class="cx-hero ...">
  <div class="container">
    <h1 class="cx-hero-title">Chassis React</h1>
    <p class="cx-hero-subtitle">React UI Component Library</p>
    <div class="cx-hero-actions">
      <a href="/react/docs/" class="button primary">Get Started</a>
      <a href="https://github.com/chassis-ui/chassis-react" class="button outline-primary">GitHub</a>
    </div>
  </div>
</section>
```

**Create src/components/homepage/Features.astro**

Highlight the key features of Chassis React:
- TypeScript-first (full type definitions)
- Accessible (ARIA patterns built-in)
- Design system aligned (Chassis CSS + tokens)
- Tree-shakeable (import only what you need)
- Tested (242+ unit tests)

```astro
<section class="cx-features ...">
  <div class="container">
    <div class="row g-4">
      <!-- Feature cards -->
    </div>
  </div>
</section>
```

### 3. Update src/pages/react/index.astro (Full Homepage)

Replace the placeholder page from Phase 5 with the full homepage using `BaseLayout`:

```astro
---
import BaseLayout from '@chassis-ui/docs/layouts/BaseLayout.astro'
import Hero from '@components/homepage/Hero.astro'
import Features from '@components/homepage/Features.astro'
---
<BaseLayout title="Chassis React — React UI Component Library" isHome={true}>
  <Hero />
  <Features />
</BaseLayout>
```

### 4. Ensure Static Assets

The `chassis()` integration (Phase 3) copies assets during build. Verify the `static/` directory structure:

`packages/site/static/` should contain:
- `static/js/react-example.js` ← created in step 1
- `static/CNAME` (if needed) ← should be at `packages/site/static/CNAME` with value `chassis-ui.com`

Check whether other chassis sites have a `static/CNAME`:
```bash
ls /Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/static/
```

Also verify the `public/` directory is not pre-populated with stale assets from previous builds.

### 5. Create CNAME (if not already in place)

If this site serves from a subdirectory of chassis-ui.com (which it does, at `/react/`), the CNAME is at the top-level domain, not subdirectory. Check if chassis-website handles CNAME in its `_site/CNAME` — if so, chassis-react should NOT have a conflicting CNAME.

Look at `chassis-figma/site/static/` — does it have a CNAME? What value?

For chassis-react as a sub-path site (under chassis-ui.com/react/), do NOT add a standalone CNAME unless it's deployed separately.

### 6. Create src/assets/ directory

Create `packages/site/src/assets/` with any site-specific images:
- `packages/site/src/assets/logo.svg` (if needed for og:image or favicon)

Check what the `BaseLayout` from `@chassis-ui/docs` expects for the meta OG image. Copy the approach from chassis-figma.

## Verification

```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
pnpm --filter chassis-react-site astro dev --port 4327
```

In a browser:
- `http://localhost:4327/` → redirects to `/react/`
- `http://localhost:4327/react/` → homepage shows Hero and Features
- `http://localhost:4327/react/docs/getting-started/introduction/` → docs page with sidebar
- `http://localhost:4327/react/docs/button/` → Button docs with React example preview
- Static JS is available: `http://localhost:4327/static/js/react-example.js`
- Token-based dark mode toggle in topbar works

## Completion

Mark Phase 7 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.
