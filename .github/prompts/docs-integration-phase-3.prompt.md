---
mode: agent
description: 'Phase 3 of docs-integration: Create all src/libs/* files — config, path, astro integration, content, data, shortcode, remark, prism, placeholder, validation.'
---

# Docs Integration Phase 3 — Site Libs

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

**Primary reference** (copy and adapt each lib file from here):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/libs/`

**Secondary reference** (for site-specific differences):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/libs/`

## Goal

Create `packages/site/src/libs/` with all infrastructure files. These are adapted from `chassis-website/packages/website/src/libs/` with chassis-react-specific adjustments.

## Steps

Read EACH reference file fully before creating the adapted version.

### 1. Create src/libs/validation.ts

Copy from `chassis-website/packages/website/src/libs/validation.ts`. No changes needed — it defines `zVersionSemver`, `zVersionMajorMinor`, `zLanguageCode`.

### 2. Create src/libs/config.ts

Adapt from `chassis-website/packages/website/src/libs/config.ts`.

Differences from chassis-website:
- Remove `blog` section validation if not needed (keep it — config.yml has it)
- Remove fields not in chassis-react's config.yml (e.g., remove `docs_version` if not present)
- Keep all fields that ARE in chassis-react's config.yml

The schema must exactly match the keys in `packages/site/config.yml`.

### 3. Create src/libs/path.ts

Adapt from `chassis-website/packages/website/src/libs/path.ts`.

Key paths (cwd = `packages/site/` at runtime):
- `getDocsFsPath()` → `path.join(process.cwd(), getConfig().docsDir)` → resolves to `packages/site/`
- `getChassisAssetsFsPath()` → `path.join('../../vendor/assets/dist/web/docs', 'chassis')` → repo root `vendor/assets`
- `getChassisCSSFsPath()` → `path.join('node_modules/@chassis-ui/css/dist')` → relative to cwd (packages/site/)
- `getChassisIconsFsPath()` → `path.join('node_modules/@chassis-ui/icons')` → relative to cwd
- `getDocsStaticFsPath()` → `path.join(getDocsFsPath(), 'static')` → `packages/site/static/`
- `getDocsPublicFsPath()` → `path.join(getDocsFsPath(), 'public')` → `packages/site/public/`
- `getChassisDocsPath(inputPath)` → `${getConfig().docsPath}/${sanitizedInputPath}` → e.g. `/react/docs/button/`

Remove `validateChassisDocsPaths` if it relies on checking generated routes (it's optional for now, add it if the reference version is simple).

Remove `getChassisTokensFsPath` since tokens are imported via SCSS, not copied separately.
Keep `getDocsRelativePath` (used in astro.ts watchFile).

### 4. Create src/libs/content.ts

Adapt from `chassis-website/packages/website/src/libs/content.ts`.

Chassis-react specifics:
- Only `docs` collection (no `blog`, no `callouts`)
- Export: `export const docsPages = await getCollection('docs')`
- No aliasedDocsPages, blogPages, getCalloutByName (chassis-react has no blog/callouts)

### 5. Create src/libs/data.ts

Adapt from `chassis-website/packages/website/src/libs/data.ts`.

Keep only the `sidebar` data definition (remove `core-team`, `docs-versions`, `translations` which chassis-react doesn't have). Keep the generic `getData()` function and `DataSchema` type.

### 6. Create src/libs/shortcode.ts

Copy from `chassis-website/packages/website/src/libs/shortcode.ts` with minimal changes.

Key change: the `autoImportedComponentDirectories` should point to:
1. `path.join(getDocsFsPath(), 'node_modules/@chassis-ui/docs/src/components/shortcodes')` — shared shortcodes
2. `path.join(getDocsFsPath(), 'src/components/shortcodes')` — site-specific shortcodes (Example.astro, PropTable.astro)

The `autoImportedComponentDefinition` writes to `./src/types/auto-import.d.ts` (relative to cwd = packages/site/).

### 7. Create src/libs/remark.ts

Copy from `chassis-website/packages/website/src/libs/remark.ts`.

Keep `remarkCxConfig` and `remarkCxDocsref` as-is. These handle `[[config:...]]` and `[[docsref:...]]` substitutions in MDX. Even though existing MDX files may not use them, they're harmless to include and may be used in new content.

### 8. Create src/libs/prism.ts

Copy from `chassis-website/packages/website/src/libs/prism.ts` (or chassis-figma's version). 

This registers additional Prism language components (jsx, tsx, bash, etc.). Read the reference file to copy all `require`/`import` calls.

### 9. Create src/libs/placeholder.ts

Copy from `chassis-website/packages/website/src/libs/placeholder.ts`. The `replacePlaceholdersInHtml` function is used by the `Example.astro` shortcode to substitute `[[config:...]]` patterns in rendered HTML.

### 10. Create src/libs/astro.ts

This is the most complex lib. Adapt from `chassis-website/packages/website/src/libs/astro.ts`.

**Key adaptations for chassis-react:**
- Import `rehypeStripIsRaw` from `@chassis-ui/docs` (already does this in chassis-website)
- Import `rehypeCxTable` from `@chassis-ui/docs`
- Import `remarkCxConfig`, `remarkCxDocsref` from `./remark`
- Import path helpers from `./path`
- Import `getConfig` from `./config`
- Import `chassisAutoImport` from `./shortcode`
- Import `configurePrism` from `./prism`

Static file aliases:
```ts
const staticFileAliases = {
  '/images/apple-touch-icon.png': '/apple-touch-icon.png',
  '/images/favicon.png': '/favicon.ico'
}
```

Sitemap excludes:
```ts
const sitemapExcludes = ['/404', '/react']
```
(Exclude home page and 404 from sitemap; all /react/docs/* pages should be indexed)

The `chassis()` function structure:
1. Returns `[chassisAutoImport(), { name: 'chassis-integration', hooks: {...} }, mdx(), sitemap({filter})]`
2. In `astro:config:setup` hook: add watchFile, updateConfig (rehype/remark plugins)
3. In `astro:config:done` hook: cleanPublicDirectory, copyStatic, copyChassisAssets, copyChassisCSS, copyChassisIcons, aliasStatic
4. In `astro:build:done` hook: (optional) validateChassisDocsPaths

**Do NOT include** `injectSubProjectSitemaps` (that's specific to chassis-website which combines multiple sites' sitemaps).

Copy `copyChassisAssets`, `copyChassisCSS`, `copyChassisIcons`, `copyStatic`, `copyStaticRecursively`, `cleanPublicDirectory`, `aliasStatic`, `sitemapFilter` helper functions from the reference.

The `copyChassisIcons` function should copy the SVG sprite from `node_modules/@chassis-ui/icons/` to `public/static/icons/cx-sprite.svg`. Check chassis-figma's version for the exact path.

### 11. Create src/types/auto-import.d.ts

Create a placeholder file (will be regenerated by `chassis()` on first run):
```ts
/**
 * DO NOT EDIT THIS FILE MANUALLY.
 * Auto-generated by the Chassis Astro Integration.
 */
export declare global {}
```

## Verification

- All files in `packages/site/src/libs/` created
- TypeScript: run `pnpm --filter chassis-react-site astro check` — no type errors in libs
- `getConfig()` returns the config from config.yml without throwing
- `getData('sidebar')` returns the sidebar array from sidebar.yml

## Completion

Mark Phase 3 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.
