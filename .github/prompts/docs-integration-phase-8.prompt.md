---
mode: agent
description: 'Phase 8 of docs-integration: Full build verification — run pnpm site:build, check output, fix remaining issues, validate all pages, update phase-status to complete.'
---

# Docs Integration Phase 8 — Build Verification

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/phase-status.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

## Goal

Verify the complete build succeeds end-to-end. Fix any remaining issues. Mark all phases complete.

## Steps

### 1. Sync Submodules

Ensure `vendor/assets` submodule is populated:
```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
node build/sync-submodules.js
```

Verify `vendor/assets/dist/web/docs/chassis/` exists and contains CSS/font files.

### 2. Full Production Build

```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
pnpm site:build
```

This should run the build script from Phase 1's `package.json` setup. If that script doesn't exist yet, run:
```bash
pnpm --filter chassis-react-site astro build
```

Monitor the output for:
- ✅ All pages generated (should be 44+ pages)
- ✅ SCSS compiled without warnings
- ✅ Sitemap generated: `_site/sitemap-index.xml`, `_site/sitemap-0.xml`
- ✅ Static assets copied: `_site/static/css/`, `_site/static/js/`, `_site/static/fonts/`, `_site/static/icons/`
- ✅ No TypeScript errors
- ❌ Fix any build errors before proceeding

### 3. Verify Output Structure

Check the `_site/` directory structure:
```bash
ls /Volumes/Ozgur/Dropbox/Sites/chassis-react/_site/
```

Expected top-level items:
- `index.html` (redirect to /react/)
- `404.html`
- `robots.txt`
- `sitemap-index.xml`
- `sitemap-0.xml`
- `react/` directory
- `static/` directory

```bash
ls /Volumes/Ozgur/Dropbox/Sites/chassis-react/_site/react/
```

Expected: `index.html`, `docs/` directory

```bash
ls /Volumes/Ozgur/Dropbox/Sites/chassis-react/_site/react/docs/ | head -20
```

Expected: all component slug directories.

```bash
ls /Volumes/Ozgur/Dropbox/Sites/chassis-react/_site/static/
```

Expected: `css/`, `fonts/`, `icons/`, `js/`, `images/`

### 4. Content Validation

Spot-check key pages for correct HTML output:

```bash
# Check Button page has example content
grep -c "cxd-example" _site/react/docs/button/index.html

# Check PropTable content
grep -c "prop-table" _site/react/docs/button/index.html

# Check sidebar is present
grep -c "cxd-sidebar" _site/react/docs/button/index.html

# Check TOC is present
grep -c "cxd-toc" _site/react/docs/button/index.html

# Check dark mode toggle in topbar
grep -c "color-mode" _site/react/docs/button/index.html
```

### 5. Dev Server Visual Verification

Start the dev server:
```bash
pnpm --filter chassis-react-site astro dev --port 4327
```

Check in browser (or use `curl`):

**Navigation and routing:**
- `http://localhost:4327/` → 301/302 redirect to /react/
- `http://localhost:4327/react/` → homepage with Chassis React hero
- `http://localhost:4327/react/docs/` → redirect to /react/docs/getting-started/introduction/
- `http://localhost:4327/react/docs/getting-started/introduction/` → Introduction page
- `http://localhost:4327/react/docs/button/` → Button component page

**Visual elements (manual check):**
- Sidebar shows all sections: Getting Started, Layout, Components, Forms, Patterns
- Active page is highlighted in sidebar
- TOC shows headings for current page
- Dark/light mode toggle works
- Algolia search box present in topbar
- Code blocks have syntax highlighting
- Tables render with Chassis table styles

**Assets:**
- Fonts load: check DevTools Network tab for `.woff2` requests
- Icons sprite loads: `http://localhost:4327/static/icons/cx-sprite.svg`
- CSS loads: `http://localhost:4327/static/css/` or inline via Vite

### 6. React Examples Verification

Verify React component examples render correctly:
- Button page: interactive button renders (not just HTML)
- Form controls: inputs render correctly
- Modal: modal component loads without JS errors in console

If examples don't render, check:
1. `@astrojs/react` is in integrations (Phase 4)
2. `client:load` or `client:visible` directive is on the React island (ExamplePreview.tsx)

### 7. Sitemap Validation

```bash
# Check sitemap contains expected URLs
grep -c "chassis-ui.com/react/docs/" _site/sitemap-0.xml

# Verify excluded pages are NOT in sitemap
grep "chassis-ui.com/react\"" _site/sitemap-0.xml
grep "chassis-ui.com/404" _site/sitemap-0.xml
```

The sitemap should contain all 40+ doc pages but NOT the home page or 404.

### 8. Algolia Index Check

Verify the Algolia plugin ran during build (check build output for Algolia-related messages). If the Algolia API key is not set (e.g., in a CI environment), the plugin should gracefully skip. Document any Algolia env vars needed:
- `ALGOLIA_APP_ID`
- `ALGOLIA_WRITE_API_KEY`
- `ALGOLIA_INDEX_NAME`

### 9. Fix Any Remaining Issues

Common issues to fix:
- **SCSS import not found**: Check that `@chassis-ui/css/scss/...` paths match the actual file structure in chassis-css
- **Path alias not resolving**: Verify tsconfig.json paths in Phase 2
- **Auto-import type errors**: Run `pnpm --filter chassis-react-site astro sync` to regenerate `.astro` type declarations
- **React hydration errors**: Ensure ReactExample island has the proper client directive
- **Missing sidebar items**: Cross-check sidebar.yml against content/ directory

### 10. Update All Phase Statuses

Mark all phases complete in `.github/skills/docs-integration/references/phase-status.md`:
- `[x]` for Phases 1-8

Also update `react-migration` skill's phase status:
- `.github/skills/react-migration/references/phase-status.md` — note that docs-integration is the successor project

## Final Checklist

Before marking Phase 8 complete, verify ALL of the following:

- [ ] `pnpm site:build` exits with code 0
- [ ] All 44+ pages in `_site/react/docs/`
- [ ] Sidebar renders correctly on all pages
- [ ] TOC renders on pages with headings
- [ ] Dark mode toggle works
- [ ] Algolia search box present
- [ ] React component previews render
- [ ] PropTable renders for all component pages
- [ ] SCSS compiled without errors
- [ ] Fonts load in browser
- [ ] Icon sprite loads
- [ ] Sitemap generated with correct URLs
- [ ] robots.txt contains correct rules
- [ ] No console errors in browser

## Completion

Mark Phase 8 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.

**docs-integration is complete!**
