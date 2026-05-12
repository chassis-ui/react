---
name: mdx-content-migration
description: 'Phase 5 of chassis-react migration: migrate 25+ MDX component files from MDX v1 (Gatsby) to MDX v3 (Astro), fix implicit globals, update frontmatter schema, rename Example to ReactExample. Run after Phase 4 is complete.'
---

# Phase 5 — MDX Content Migration

**Prerequisite**: Phase 4 (`<ReactExample>` island) must be complete.  
**Check**: `.github/skills/react-migration/references/phase-status.md` Phase 4 = `[x]`  
**Completion marker**: Update Phase 5 status to `[x]` in phase-status.md

## Context

The old Gatsby docs used MDX v1 with implicit global components (`<Example>`, `<Callout>` available without imports). MDX v3 in Astro requires all components to be explicitly imported. There are 25 component MDX files plus files in `forms/`, `getting-started/`, `layout/`, and `patterns/`.

Content is already copied to `packages/site/content/` (done in Phase 3). This phase transforms those files in-place.

## MDX v1 → v3 Key Changes

| Issue | Old (v1) | New (v3) |
|-------|----------|----------|
| Global components | Used without import | Must be explicitly imported |
| `export default` | Allowed in body | Only in frontmatter or separate file |
| Component imports | `import { X } from '...'` at top | Same, but now strictly required |
| JSX expressions | Slightly more lenient | Stricter — must be valid JSX |
| Remark/Rehype | v1 plugins | v3 plugins (different APIs) |

## Step 1 — Audit all MDX files

List all MDX files to process:
```sh
find packages/site/content -name "*.mdx" | sort
```

Expected sections:
- `components/` — 25 files
- `forms/` — several files
- `getting-started/` — several files
- `layout/` — several files
- `patterns/` — several files

## Step 2 — Update frontmatter schema

Current Gatsby frontmatter:
```yaml
---
title: Buttons Component
name: Bootstrap React Buttons
description: ...
menu: Components
route: /components/buttons
---
```

Target Astro frontmatter (matches `reactDocsSchema` from Phase 3):
```yaml
---
title: Button
description: ...
added:
  version: "1.0"
toc: true
---
```

Rules:
- `title`: shorten to just the component name (remove "Component" suffix)
- `description`: keep as-is or improve
- Remove `name`, `menu`, `route` fields (not in schema)
- Add `added.version: "1.0"` to all
- Add `toc: true` to pages with multiple sections

## Step 3 — Add explicit component imports to every MDX file

Every MDX file that uses `<Example>` or `<Callout>` needs these imports added at the top (after frontmatter):

```mdx
import ReactExample from '../../src/components/ReactExample/ReactExample.astro'
import Callout from '../../src/components/Callout.astro'
```

Adjust relative paths based on content directory depth.

**Alternatively**, configure MDX component mapping in `astro.config.ts` to provide global components (Astro supports this via `remarkPlugins` or the MDX integration's `components` option). This eliminates per-file imports. Decide which approach to use before starting — global mapping is cleaner for many files.

To use global component mapping in Astro MDX:
```ts
// astro.config.ts
import mdx from '@astrojs/mdx'
import ReactExample from './src/components/ReactExample/ReactExample.astro'
import Callout from './src/components/Callout.astro'

mdx({
  components: {
    Example: ReactExample,   // maps old <Example> → new <ReactExample>
    Callout: Callout
  }
})
```

**Recommended**: Use global component mapping for `Callout`. For `<ReactExample>`, individual imports give more control (some examples may need `client:load` override).

## Step 4 — Replace `<Example>` with `<ReactExample>`

In every MDX file, replace:
```mdx
<Example>
  ...
</Example>
```
with:
```mdx
<ReactExample>
  ...
</ReactExample>
```

If using global mapping from Step 3 that maps `Example → ReactExample`, skip this step.

## Step 5 — Update React component imports

Current MDX files import from the local source:
```mdx
import { CxButton } from '@chassis-ui/react/src/index'
```

Update to import from the built package or the workspace:
```mdx
import { CxButton } from '@chassis-ui/react'
```

This requires `@chassis-ui/react` dist to be built (Phase 1). Verify the import resolves correctly.

## Step 6 — Fix any MDX v3 syntax issues

Common issues to check per file:
- `export default` in body → remove or move to frontmatter
- Inline expressions like `{variable}` outside JSX context → wrap properly
- Self-closing non-void HTML elements (e.g., `<br>` → `<br />`)
- Unquoted attribute values in JSX → quote them

## Step 7 — Process files systematically

Work through content sections one at a time:
1. `getting-started/` — typically fewer examples, good warmup
2. `components/` — 25 files, main content
3. `forms/` — form-specific components
4. `layout/` — grid, container components
5. `patterns/` — usage pattern examples

For each file:
1. Update frontmatter
2. Add/verify imports
3. Replace `<Example>` usage
4. Update React component import paths
5. Fix any syntax issues
6. Verify it parses (run `pnpm dev` and navigate to the page)

## Step 8 — Verify all pages build

```sh
pnpm --filter @chassis-ui/react-site build
```

Fix any MDX parse errors. The build must complete with no errors.

## Step 9 — Create `Callout.astro` if not already done

If `packages/site/src/components/Callout.astro` doesn't exist yet:

```astro
---
interface Props {
  context?: 'info' | 'warning' | 'danger' | 'tip'
}
const { context = 'info' } = Astro.props
---
<div class={`cxd-callout cxd-callout-${context}`}>
  <slot />
</div>
```

## Step 10 — Mark complete

Update phase-status.md Phase 5 to `[x]`.

## Verification Checklist

- [ ] All MDX files have updated frontmatter (no `route`, `menu`, `name` fields)
- [ ] All MDX files use `<ReactExample>` (or mapped global)
- [ ] All React component imports use `@chassis-ui/react` (not `/src/index`)
- [ ] `pnpm --filter @chassis-ui/react-site build` succeeds with no MDX errors
- [ ] Spot-check: navigate to 3-5 component pages in dev — live previews work
- [ ] `Callout` renders correctly on pages that use it
- [ ] Getting started pages render correctly
