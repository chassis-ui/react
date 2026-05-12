---
mode: agent
description: 'Phase 6 of docs-integration: Migrate components to shortcodes/ directory for auto-import, wire React Example island and PropTable as auto-imported shortcodes, adapt Callout handling.'
---

# Docs Integration Phase 6 — Shortcodes

Read the skill and references before starting:
- `.github/skills/docs-integration/SKILL.md`
- `.github/skills/docs-integration/references/codebase-facts.md`

**Reference files** (read all before writing):
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/components/shortcodes/Example.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/components/shortcodes/Code.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/website/src/libs/shortcode.ts`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-website/packages/docs/src/components/shortcodes/Callout.astro`
- `/Volumes/Ozgur/Dropbox/Sites/chassis-figma/site/src/components/shortcodes/`

## Goal

Set up shortcodes so that `<Example>`, `<PropTable>`, `<Callout>`, and any other MDX components work without explicit imports in every MDX file. The `chassis()` integration uses `astro-auto-import` to make shortcodes globally available.

## How Auto-Import Works

`shortcode.ts` registers two directories:
1. `node_modules/@chassis-ui/docs/src/components/shortcodes/` — shared: `Callout`, `AddedIn`, `CxTable`, `DeprecatedIn`, `InFigma`, `Blockquote`, `CSSOnly`
2. `src/components/shortcodes/` — site-specific: `Example`, `PropTable` (chassis-react additions)

Any `.astro` file in these directories is auto-imported into all MDX files.

## Steps

### 1. Create src/components/shortcodes/Example.astro

This is the React-specific example component. It replaces `ExampleWrapper.astro` and the old `components={{ Example: ExampleWrapper }}` mapping.

The component should:
- Accept `code?: string` prop (optional — for showing source)
- Render the slot content (React island) in a `<div class="cxd-example context">` wrapper
- Optionally render a `<Code>` block below the example

Read `chassis-website/packages/website/src/components/shortcodes/Example.astro` for the full structure and props interface. The key difference for chassis-react is:
- The slot contains a **React island** (passed from MDX as JSX), not raw HTML
- We don't use StackBlitz for React examples

Minimal structure:
```astro
---
interface Props {
  class?: string
  id?: string
}
const { class: className, id } = Astro.props
---
<div class:list={['cxd-example-snippet']}>
  <div class:list={['cxd-example context', className]} id={id}>
    <slot />
  </div>
</div>
```

Check whether MDX files use `<Example>` with any props beyond just wrapping content. Examine a few MDX files in `packages/site/content/` to understand usage patterns.

### 2. Create src/components/shortcodes/PropTable.astro  

Move/copy from `packages/site/src/components/PropTable.astro` to `packages/site/src/components/shortcodes/PropTable.astro`.

This is identical to the existing PropTable.astro but now lives in the shortcodes directory so it's auto-imported. Remove the old `PropTable.astro` from `src/components/`.

Verify it still correctly does `getEntry('api', component.toLowerCase())`.

### 3. Handle Callout

The `@chassis-ui/docs` shortcodes already include `Callout.astro`. However, chassis-react's MDX content uses `<Callout>` in a different way (via the old `CalloutReact.tsx`).

**Investigation step**: Grep the MDX content for `<Callout` usage:
```bash
grep -r "<Callout" packages/site/content/
```

Based on what you find:
- If MDX files use `<Callout type="warning">...</Callout>` style → the auto-imported `@chassis-ui/docs` Callout shortcode handles it
- If MDX files use `<Callout name="...">` style (named callout from collection) → the docs Callout also handles it
- If `CalloutReact.tsx` had custom React logic → port that logic to the Astro shortcode OR use the docs Callout and delete CalloutReact.tsx

After resolving: delete `packages/site/src/components/CalloutReact.tsx` if it's no longer needed.

### 4. Remove ExampleWrapper.astro

Delete `packages/site/src/components/ReactExample/ExampleWrapper.astro` — it's replaced by `shortcodes/Example.astro`.

Keep `packages/site/src/components/ReactExample/` folder and its React island files (`ReactExample.astro`, `ExamplePreview.tsx`, etc.) if they are used by `Example.astro`.

### 5. Verify src/libs/shortcode.ts wiring

Ensure `shortcode.ts` (created in Phase 3) correctly points to both directories and that the `auto-import.d.ts` type file will be generated with `Example` and `PropTable` type declarations.

### 6. Update [...slug].astro (remove components mapping)

In `packages/site/src/pages/react/docs/[...slug].astro`, remove any `components={{ }}` prop if present. The shortcodes are auto-imported, so no explicit component mapping is needed.

If you kept `components={{ pre: Code }}` from the chassis-website pattern, that's OK — the `Code.astro` shortcode from `@chassis-ui/docs` handles syntax highlighting of code blocks.

Actually: add `components={{ pre: Code }}` to use the shared Code component for code blocks:
```astro
import Code from '@shortcodes/Code.astro'
// in template:
<Content components={{ pre: Code }} />
```

### 7. Scan and fix MDX files

After auto-import is set up, any explicit imports in MDX files that were previously needed are now redundant. Check MDX files for:
- `import { CalloutReact } from ...` → remove, use auto-imported `<Callout>`
- `import PropTable from ...` → remove (auto-imported)
- Any other component imports

Run a grep:
```bash
grep -r "^import " packages/site/content/ | head -20
```

MDX files should have zero explicit component imports after Phase 6 (except for example .tsx files which ARE valid imports in MDX).

## Verification

Run the full build:
```bash
cd /Volumes/Ozgur/Dropbox/Sites/chassis-react
pnpm --filter chassis-react-site astro build
```

All 44+ pages should build without errors. Verify:
- Pages with `<Example>` components render correctly
- Pages with `<PropTable>` show the prop table
- Pages with `<Callout>` show the callout box
- `_site/react/docs/button/index.html` contains the example markup

## Completion

Mark Phase 6 `[x]` in `.github/skills/docs-integration/references/phase-status.md`.
